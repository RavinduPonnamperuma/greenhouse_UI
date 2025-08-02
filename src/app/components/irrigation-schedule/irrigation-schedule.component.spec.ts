import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigationScheduleComponent } from './irrigation-schedule.component';

describe('IrrigationScheduleComponent', () => {
  let component: IrrigationScheduleComponent;
  let fixture: ComponentFixture<IrrigationScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IrrigationScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrigationScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
