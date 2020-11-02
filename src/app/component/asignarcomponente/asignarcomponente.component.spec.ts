import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarcomponenteComponent } from './asignarcomponente.component';

describe('AsignarcomponenteComponent', () => {
  let component: AsignarcomponenteComponent;
  let fixture: ComponentFixture<AsignarcomponenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarcomponenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarcomponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
