import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtributoeditarComponent } from './atributoeditar.component';

describe('AtributoeditarComponent', () => {
  let component: AtributoeditarComponent;
  let fixture: ComponentFixture<AtributoeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtributoeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtributoeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
