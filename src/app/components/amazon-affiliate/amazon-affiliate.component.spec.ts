import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonAffiliateComponent } from './amazon-affiliate.component';

describe('AmazonAffiliateComponent', () => {
  let component: AmazonAffiliateComponent;
  let fixture: ComponentFixture<AmazonAffiliateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmazonAffiliateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazonAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
