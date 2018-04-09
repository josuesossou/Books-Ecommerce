import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldBooksComponent } from './sold-books.component';

describe('SoldBooksComponent', () => {
  let component: SoldBooksComponent;
  let fixture: ComponentFixture<SoldBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
