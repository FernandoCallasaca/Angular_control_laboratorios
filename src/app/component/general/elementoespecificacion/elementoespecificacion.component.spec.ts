import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoespecificacionComponent } from './elementoespecificacion.component';

describe('ElementoespecificacionComponent', () => {
  let component: ElementoespecificacionComponent;
  let fixture: ComponentFixture<ElementoespecificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementoespecificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementoespecificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
