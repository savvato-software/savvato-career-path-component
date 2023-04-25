import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavvatoCareerpathComponentComponent } from './savvato-careerpath-component.component';

describe('SavvatoCareerpathComponentComponent', () => {
  let component: SavvatoCareerpathComponentComponent;
  let fixture: ComponentFixture<SavvatoCareerpathComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavvatoCareerpathComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavvatoCareerpathComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
