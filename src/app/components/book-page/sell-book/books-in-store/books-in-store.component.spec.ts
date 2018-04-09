import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksInStoreComponent } from './books-in-store.component';

describe('BooksInStoreComponent', () => {
  let component: BooksInStoreComponent;
  let fixture: ComponentFixture<BooksInStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksInStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksInStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
