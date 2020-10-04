import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoboSiniestroFormatoComponent } from './robo-siniestro-formato.component';

describe('RoboSiniestroFormatoComponent', () => {
  let component: RoboSiniestroFormatoComponent;
  let fixture: ComponentFixture<RoboSiniestroFormatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoboSiniestroFormatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoboSiniestroFormatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
