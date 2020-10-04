import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconexionCorteFormatoComponent } from './reconexion-corte-formato.component';

describe('ReconexionCorteFormatoComponent', () => {
  let component: ReconexionCorteFormatoComponent;
  let fixture: ComponentFixture<ReconexionCorteFormatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconexionCorteFormatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconexionCorteFormatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
