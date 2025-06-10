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
  isSubmitting = false;
  errorMessage: string | null = null;
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
      plantName: ['', [Validators.required, Validators.minLength(2)]],
      status: ['', [Validators.required, Validators.minLength(2)]],
      cost: ['', [Validators.required, Validators.min(0)]],
      harvestTime: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      polytunnelId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.plantForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.plantForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.plantForm.invalid) {
      this.plantForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', this.plantForm.value);
      this.isSubmitting = false;
      // Reset form or handle success as needed
    }, 1000);
  }
}
