import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoespecificacioneditarComponent } from './elementoespecificacioneditar.component';

describe('ElementoespecificacioneditarComponent', () => {
  let component: ElementoespecificacioneditarComponent;
  let fixture: ComponentFixture<ElementoespecificacioneditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementoespecificacioneditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementoespecificacioneditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
