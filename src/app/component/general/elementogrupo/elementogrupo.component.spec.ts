import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementogrupoComponent } from './elementogrupo.component';

describe('ElementogrupoComponent', () => {
  let component: ElementogrupoComponent;
  let fixture: ComponentFixture<ElementogrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementogrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementogrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
