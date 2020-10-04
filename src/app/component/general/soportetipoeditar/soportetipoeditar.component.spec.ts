import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoportetipoeditarComponent } from './soportetipoeditar.component';

describe('SoportetipoeditarComponent', () => {
  let component: SoportetipoeditarComponent;
  let fixture: ComponentFixture<SoportetipoeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoportetipoeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoportetipoeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
