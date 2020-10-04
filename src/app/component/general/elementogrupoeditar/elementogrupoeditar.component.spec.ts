import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementogrupoeditarComponent } from './elementogrupoeditar.component';

describe('ElementogrupoeditarComponent', () => {
  let component: ElementogrupoeditarComponent;
  let fixture: ComponentFixture<ElementogrupoeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementogrupoeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementogrupoeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
