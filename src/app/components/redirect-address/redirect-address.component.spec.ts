import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectAddressComponent } from './redirect-address.component';

describe('RedirectAddressComponent', () => {
  let component: RedirectAddressComponent;
  let fixture: ComponentFixture<RedirectAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
