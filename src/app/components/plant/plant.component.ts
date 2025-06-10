import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ChartComponent} from "ng-apexcharts";

@Component({
  selector: 'app-plant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    ChartComponent
  ],
  templateUrl: './plant.component.html',
  styleUrl: './plant.component.scss'
})
export class PlantComponent implements OnInit {
  plantForm: FormGroup;
  polytunnels = [
    { id: 1, name: 'Polytunnel 1' },
    { id: 2, name: 'Polytunnel 2' },
    { id: 3, name: 'Polytunnel 3' },
  ];
  tableData = [
    { plantName: 'Tomato', status: 'Growing', cost: 100, harvestTime: 60 },
    { plantName: 'Cucumber', status: 'Seeding', cost: 80, harvestTime: 50 },
    { plantName: 'Lettuce', status: 'Harvested', cost: 50, harvestTime: 30 },
    { plantName: 'Pepper', status: 'Growing', cost: 120, harvestTime: 70 },
  ];

  constructor(private fb: FormBuilder) {
    this.plantForm = this.fb.group({
      plantName: ['Tomato', Validators.required],
      status: ['growing', Validators.required],
      cost: [100, [Validators.required, Validators.min(0)]],
      harvestTime: [60, [Validators.required, Validators.min(0)]],
      startDate: ['2025-06-01', Validators.required],
      endDate: ['2025-08-01', Validators.required],
      polytunnelId: [1, Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.plantForm.valid) {
      console.log('Form submitted:', this.plantForm.value);
    }
  }
}
