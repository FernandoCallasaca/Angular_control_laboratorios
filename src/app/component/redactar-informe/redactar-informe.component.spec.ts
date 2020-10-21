import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedactarInformeComponent } from './redactar-informe.component';

describe('RedactarInformeComponent', () => {
  let component: RedactarInformeComponent;
  let fixture: ComponentFixture<RedactarInformeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedactarInformeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
