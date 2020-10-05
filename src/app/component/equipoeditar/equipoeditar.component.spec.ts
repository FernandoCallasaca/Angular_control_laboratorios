import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoeditarComponent } from './equipoeditar.component';

describe('EquipoeditarComponent', () => {
  let component: EquipoeditarComponent;
  let fixture: ComponentFixture<EquipoeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
