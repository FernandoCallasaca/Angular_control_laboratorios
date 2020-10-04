import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartomasivoComponent } from './repartomasivo.component';

describe('RepartomasivoComponent', () => {
  let component: RepartomasivoComponent;
  let fixture: ComponentFixture<RepartomasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartomasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartomasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
