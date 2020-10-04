import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoReclamoComponent } from './formato-reclamo.component';

describe('FormatoReclamoComponent', () => {
  let component: FormatoReclamoComponent;
  let fixture: ComponentFixture<FormatoReclamoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoReclamoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoReclamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
