import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBookProccessComponent } from './buy-book-proccess.component';

describe('BuyBookProccessComponent', () => {
  let component: BuyBookProccessComponent;
  let fixture: ComponentFixture<BuyBookProccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyBookProccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBookProccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
