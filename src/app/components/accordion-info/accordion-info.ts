import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Brand } from '../../interfaces/Brand';

@Component({
  selector: 'app-accordion-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-info.html',
  styleUrl: './accordion-info.scss'
})
export class AccordionInfoComponent {
  @Input() brands: Brand[] = [];
  @Input() activeBrandKey: string = '';

   isOpen = signal(false);

  toggleAccordion(): void {
    this.isOpen.update(currentValue => !currentValue);
  }
}
