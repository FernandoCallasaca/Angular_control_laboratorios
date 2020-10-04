import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadeditarComponent } from './entidadeditar.component';

describe('EntidadeditarComponent', () => {
  let component: EntidadeditarComponent;
  let fixture: ComponentFixture<EntidadeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntidadeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntidadeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
