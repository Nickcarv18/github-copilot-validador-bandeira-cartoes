import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardData } from '../../interfaces/CardData';

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-card-form.html',
  styleUrl: './credit-card-form.scss'
})
export class CreditCardFormComponent {
  @Output() cardChange = new EventEmitter<CardData>();

  cardNumber = signal('');
  expiryDate = signal('');
  cardBrand = signal('');
  isExpired = signal(false);
  isLuhnValid = signal(false);

  private brandNames: Record<string, string> = {
    visa: "Visa",
    mastercard: "MasterCard",
    amex: "American Express",
    diners: "Diners Club",
    discover: "Discover",
    jcb: "JCB",
    hipercard: "HiperCard",
    elo: "Elo",
    aura: "Aura"
  };

  constructor() {
    effect(() => {
      const num = this.cardNumber();
      const expiry = this.expiryDate();
      const brand = this.detectBrand(num);
      const luhnValid = this.validateLuhn(num);
      const expired = this.checkExpiry(expiry);

      this.cardBrand.set(brand);
      this.isLuhnValid.set(luhnValid);
      this.isExpired.set(expired);

      this.cardChange.emit({
        number: num.replace(/\s/g, ''),
        expiryDate: expiry.replace('/', ''),
        cardBrand: brand,
        isValid: brand !== 'Desconhecida' && expiry.length === 5 && luhnValid && !expired,
        isExpired: expired
      });
    });
  }

  isCardNumberLengthValid = computed(() => {
    return this.cardNumber().replace(/\s/g, '').length >= 12;
  });

  shouldShowStatus = computed(() => {
    return !!this.cardBrand() || this.expiryDate().length === 5 || this.isCardNumberLengthValid();
  });

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '');
    const limited = cleaned.substring(0, 19);
    const formatted = limited.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber.set(formatted);
    input.value = formatted;
  }

  onExpiryDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '');
    const limited = cleaned.substring(0, 4);
    let formatted = limited;
    if (limited.length >= 2) {
      formatted = `${limited.substring(0, 2)}/${limited.substring(2, 4)}`;
    }
    this.expiryDate.set(formatted);
    input.value = formatted;
  }

  getBrandDisplayName(key: string): string {
    return this.brandNames[key] || "Desconhecida";
  }

  // --- MÉTODO ATUALIZADO ---
  private detectBrand(num: string): string {
    const n = num.replace(/\D/g, '');
    // Visa: começa com 4, 13 ou 16 dígitos
    if (/^4\d{12}(\d{3})?$/.test(n)) return 'visa';
    // MasterCard: começa com 51-55 ou 2221-2720, 16 dígitos
    if (/^(5[1-5]\d{14}|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720)\d{12})$/.test(n)) return 'mastercard';
    // Hipercard: começa com 606282, 384100, 60, 16-19 dígitos
    if (/^(606282\d{10,13}|3841\d{12,15}|60\d{14})$/.test(n)) return 'hipercard';
    // Elo: vários BINs, 16 dígitos
    if (/^(4011(78|79)|431274|438935|451416|457393|457631|457632|504175|5067[0-9]{2}|5090[0-9]{2}|627780|636297|636368|6500[0-9]{2}|6504[0-9]{2}|6505[0-9]{2}|6507[0-9]{2}|6509[0-9]{2}|6516[0-9]{2}|6550[0-9]{2})\d{10}$/.test(n)) return 'elo';
    // American Express: começa com 34 ou 37, 15 dígitos
    if (/^3[47]\d{13}$/.test(n)) return 'amex';
    // Diners Club: começa com 300-305, 36, 38, 39, 14 dígitos
    if (/^3(0[0-5]|[689]\d)\d{11}$/.test(n)) return 'diners';
    // Discover: começa com 6011, 622126-622925, 644-649, 65, 16 dígitos
    if (/^(6011\d{12}|65\d{14}|64[4-9]\d{13}|622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[01]\d|92[0-5])\d{10})$/.test(n)) return 'discover';
    // JCB: começa com 35, 16 dígitos
    if (/^35\d{14}$/.test(n)) return 'jcb';
    // Aura: começa com 50, 16 dígitos
    if (/^50\d{14}$/.test(n)) return 'aura';
    return 'Desconhecida';
  }

  private validateLuhn(number: string): boolean {
    const n = number.replace(/\D/g, '');
    if (n.length < 12) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let digit = parseInt(n[i]);
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  }

  private checkExpiry(expiry: string): boolean {
    if (expiry.length !== 5) return false;
    const [month, year] = expiry.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    const cardYear = parseInt(year);
    const cardMonth = parseInt(month);

    if (isNaN(cardYear) || isNaN(cardMonth)) return true; // Data inválida
    if (cardYear < currentYear) return true;
    if (cardYear === currentYear && cardMonth < currentMonth) return true;
    return false;
  }
}
