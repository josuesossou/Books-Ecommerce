import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectConfirmComponent } from './redirect-confirm.component';

describe('RedirectConfirmComponent', () => {
  let component: RedirectConfirmComponent;
  let fixture: ComponentFixture<RedirectConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
