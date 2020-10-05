import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoportetecnicoeditarComponent } from './soportetecnicoeditar.component';

describe('SoportetecnicoeditarComponent', () => {
  let component: SoportetecnicoeditarComponent;
  let fixture: ComponentFixture<SoportetecnicoeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoportetecnicoeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoportetecnicoeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
