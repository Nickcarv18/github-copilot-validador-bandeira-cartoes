import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-card.html',
  styleUrl: './credit-card.scss'
})
export class CreditCardComponent {
  @Input() number: string = '';
  @Input() expiryDate: string = '';
  @Input() cardBrand: string = '';

   private brandLogos: Record<string, string> = {
    visa: 'visa.png',
    mastercard: 'mastercard.png',
    amex: 'american.png',
    diners: 'diners.png',
    discover: 'discover.png',
    elo: 'elo.png',
    jcb: 'jcb.png',
    hipercard: 'hipercard.png',
    aura: 'aura.png',
  };

   private brandClasses: Record<string, string> = {
    visa: 'brand-visa',
    mastercard: 'brand-mastercard',
    amex: 'brand-amex',
    diners: 'brand-diners',
    discover: 'brand-discover',
  };

  get formattedCardNumber(): string {
    const cleaned = this.number.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.padEnd(19, '•').substring(0, 19);
  }

  get formattedExpiry(): string {
    if (!this.expiryDate) return "••/••";
    const cleaned = this.expiryDate.replace(/\D/g, '');
    return cleaned.length >= 2 ? `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}` : cleaned;
  }

  get brandLogoPath(): string | null {
    const logoFile = this.brandLogos[this.cardBrand];
    return logoFile ? `assets/${logoFile}` : null;
  }

  get brandClass(): string {
    return this.brandClasses[this.cardBrand] || 'brand-default';
  }
}
