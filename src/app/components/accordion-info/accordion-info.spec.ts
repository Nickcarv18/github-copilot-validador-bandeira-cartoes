import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionInfoComponent } from './accordion-info';

describe('AccordionInfoComponent', () => {
  let component: AccordionInfoComponent;
  let fixture: ComponentFixture<AccordionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
