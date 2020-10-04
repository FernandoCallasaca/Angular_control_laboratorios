import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteeditarComponent } from './docenteeditar.component';

describe('DocenteeditarComponent', () => {
  let component: DocenteeditarComponent;
  let fixture: ComponentFixture<DocenteeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocenteeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenteeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
