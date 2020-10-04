import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapareclamosComponent } from './mapareclamos.component';

describe('MapareclamosComponent', () => {
  let component: MapareclamosComponent;
  let fixture: ComponentFixture<MapareclamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapareclamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapareclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
