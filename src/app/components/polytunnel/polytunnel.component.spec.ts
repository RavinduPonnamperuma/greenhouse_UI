import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolytunnelComponent } from './polytunnel.component';

describe('PolytunnelComponent', () => {
  let component: PolytunnelComponent;
  let fixture: ComponentFixture<PolytunnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolytunnelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolytunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
