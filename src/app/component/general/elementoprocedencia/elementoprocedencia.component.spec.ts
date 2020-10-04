import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoprocedenciaComponent } from './elementoprocedencia.component';

describe('ElementoprocedenciaComponent', () => {
  let component: ElementoprocedenciaComponent;
  let fixture: ComponentFixture<ElementoprocedenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementoprocedenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementoprocedenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
