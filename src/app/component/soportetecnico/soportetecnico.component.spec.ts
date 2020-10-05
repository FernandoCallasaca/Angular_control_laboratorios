import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoportetecnicoComponent } from './soportetecnico.component';

describe('SoportetecnicoComponent', () => {
  let component: SoportetecnicoComponent;
  let fixture: ComponentFixture<SoportetecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoportetecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoportetecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
