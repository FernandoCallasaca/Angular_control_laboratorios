import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoinventarioComponent } from './formatoinventario.component';

describe('FormatoinventarioComponent', () => {
  let component: FormatoinventarioComponent;
  let fixture: ComponentFixture<FormatoinventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoinventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoinventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
