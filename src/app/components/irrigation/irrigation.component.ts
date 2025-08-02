import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {PlantService} from "../../services/plant.service";
import {PlantDto} from "../../interfaces/plant.interface";
import {IrrigationService} from "../../services/irrigation.service";
import {IrrigationDTO} from "../../interfaces/irrigation.entity";
import {NotificationService} from "../Utility/notification/notification.service";


interface Irrigation {
  waterPerDay: number;
  fertilizerPerDay: number;
  timesPerDay: number;
  isMorning: number;
  morningTime: string;
  isEvening: number;
  eveningTime: string;
  duration: number;
  plantId: number;
}

@Component({
  selector: 'app-irrigation',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './irrigation.component.html',
  styleUrl: './irrigation.component.scss'
})
export class IrrigationComponent {

  plantService = inject(PlantService)
  irrigationService = inject(IrrigationService)
  notificationService = inject(NotificationService)
  plantDtos: PlantDto[] = []
  irrigationDTOS: IrrigationDTO[] = []
  irrigationForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;


  constructor(private fb: FormBuilder) {
    this.plantGetAll();
    this.getAllIrrigations();
    this.irrigationForm = this.fb.group({
      waterPerDay: ['', [Validators.required, Validators.min(0)]],
      fertilizerPerDay: ['', [Validators.required, Validators.min(0)]],
      timesPerDay: ['', [Validators.required, Validators.min(1)]],
      isMorning: ['', Validators.required],
      morningTime: ['', Validators.required],
      isEvening: ['', Validators.required],
      eveningTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      plantId: ['', Validators.required],
    });
  }


  plantGetAll() {
    this.plantService.getAll().subscribe({
      next: data => {
        this.plantDtos = data.data
      }
    })
  }

  getAllIrrigations() {
    this.irrigationService.getAll().subscribe({
      next: data => {
        this.irrigationDTOS = Array.isArray(data.data) ? data.data : [data.data];
      },
      error: err => {
        console.error('Failed to fetch irrigations:', err);
        this.errorMessage = 'Failed to load irrigation data.';

      }
    });
  }


  get f() {
    return this.irrigationForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.irrigationForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.irrigationForm.invalid) {
      this.irrigationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue: Irrigation = this.irrigationForm.value;
    const payload = {
      waterPerDay: this.irrigationForm.value.waterPerDay.toString(),
      fertilizerPerDay: this.irrigationForm.value.fertilizerPerDay.toString(),
      timesPerDay: +this.irrigationForm.value.timesPerDay,
      isMorning: this.irrigationForm.value.isMorning === '1',
      morningTime: this.irrigationForm.value.morningTime,
      isEvening: this.irrigationForm.value.isEvening === '1',
      eveningTime: this.irrigationForm.value.eveningTime,
      duration: +this.irrigationForm.value.duration,
      plantId:  + this.irrigationForm.value.plantId
    };
    this.irrigationService.createPlant(payload).subscribe({
      next: data => {
        this.notificationService.showSuccess('New irrigation added successfully', 3000);
        this.isSubmitting = false;
        this.reset()
      },
      error: (err) => {
        console.error('Failed to create irrigation:', err);
        this.notificationService.showError('Failed to add irrigation schedule. Please try again.', 5000);
        this.isSubmitting = false;
      }
    });
  }

  reset() {
    this.irrigationForm.reset();
    this.getAllIrrigations();
    this.plantGetAll();
  }


}
