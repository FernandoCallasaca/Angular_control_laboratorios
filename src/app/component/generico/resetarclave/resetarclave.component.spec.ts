import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetarclaveComponent } from './resetarclave.component';

describe('ResetarclaveComponent', () => {
  let component: ResetarclaveComponent;
  let fixture: ComponentFixture<ResetarclaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetarclaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetarclaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
