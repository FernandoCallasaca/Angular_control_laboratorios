import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoprocedenciaeditarComponent } from './elementoprocedenciaeditar.component';

describe('ElementoprocedenciaeditarComponent', () => {
  let component: ElementoprocedenciaeditarComponent;
  let fixture: ComponentFixture<ElementoprocedenciaeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementoprocedenciaeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementoprocedenciaeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
