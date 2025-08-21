import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AccordionInfoComponent } from './components/accordion-info/accordion-info';
import { CreditCardFormComponent } from './components/credit-card-form/credit-card-form';
import { CreditCardComponent } from './components/credit-card/credit-card';
import { Brand } from './interfaces/Brand';
import { CardData } from './interfaces/CardData';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CreditCardComponent,
    CreditCardFormComponent,
    AccordionInfoComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  cardData = signal<CardData>({
    number: "",
    expiryDate: "",
    cardBrand: "",
    isValid: false,
    isExpired: false
  });

  supportedBrands: Brand[] = [
    { key: "visa", name: "Visa" },
    { key: "mastercard", name: "MasterCard" },
    { key: "amex", name: "American Express" },
    { key: "diners", name: "Diners Club" },
    { key: "discover", name: "Discover" },
    { key: "jcb", name: "JCB" },
    { key: "hipercard", name: "HiperCard" },
    { key: "aura", name: "Aura" }
  ];

  onCardChange(data: CardData): void {
    this.cardData.set(data);
  }
}
