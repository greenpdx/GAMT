import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TNVInfoComponent } from './tnvinfo.component';

describe('TNVInfoComponent', () => {
  let component: TNVInfoComponent;
  let fixture: ComponentFixture<TNVInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TNVInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TNVInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
