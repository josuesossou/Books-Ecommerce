import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPurchasesComponent } from './book-purchases.component';

describe('BookPurchasesComponent', () => {
  let component: BookPurchasesComponent;
  let fixture: ComponentFixture<BookPurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookPurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
