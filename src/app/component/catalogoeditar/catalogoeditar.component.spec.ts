import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoeditarComponent } from './catalogoeditar.component';

describe('CatalogoeditarComponent', () => {
  let component: CatalogoeditarComponent;
  let fixture: ComponentFixture<CatalogoeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
