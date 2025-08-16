import { Component, inject } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PlantService } from "../../services/plant.service";
import { NotificationService } from "../Utility/notification/notification.service";
import { IrrigationService } from "../../services/irrigation.service";
import { PlantDto } from "../../interfaces/plant.interface";
import { IrrigationDTO } from "../../interfaces/irrigation.entity";
import {IrrigationTaskService} from "../../services/IrrigationTask.service";

interface IrrigationPayload {
  waterPerDay: number;
  fertilizerPerDay: number;
  timesPerDay: number;
  isMorning: boolean;
  morningTime: string | null;
  isEvening: boolean;
  eveningTime: string | null;
  duration: number;
  plantId: number;
}

@Component({
  selector: 'app-irrigation-schedule',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './irrigation-schedule.component.html',
  styleUrl: './irrigation-schedule.component.scss'
})
export class IrrigationScheduleComponent {
  private fb = inject(FormBuilder);
  private plantService = inject(PlantService);
  private irrigationService = inject(IrrigationService);
  private irrigationTaskService = inject(IrrigationTaskService);
  private notificationService = inject(NotificationService);

  scheduleForm: FormGroup;
  schedules: IrrigationDTO[] = [];
  plants: PlantDto[] = [];
  showModal = false;
  isSubmitting = false;
  editingSchedule: IrrigationDTO | null = null;
  errorMessage: string | null = null;

  constructor() {
    this.scheduleForm = this.fb.group({
      waterPerDay: [0, [Validators.required, Validators.min(0.1)]],
      fertilizerPerDay: [0, [Validators.required, Validators.min(0)]],
      timesPerDay: [1, [Validators.required, Validators.min(1)]],
      isMorning: [false],
      morningTime: [''],
      isEvening: [false],
      eveningTime: [''],
      duration: [10, [Validators.required, Validators.min(1)]],
      plantId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllPlants();
    this.getAllSchedules();
  }

  get f() {
    return this.scheduleForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.scheduleForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getAllPlants() {
    this.plantService.getAll().subscribe({
      next: (res) => {
        this.plants = Array.isArray(res.data) ? res.data : [res.data];
      },
      error: () => {
        this.notificationService.showError("Failed to load plants", 5000);
      }
    });
  }

  getAllSchedules() {
    this.irrigationService.getAll().subscribe({
      next: (res) => {
        this.schedules = Array.isArray(res.data) ? res.data : [res.data];
      },
      error: () => {
        this.notificationService.showError("Failed to load schedules", 5000);
      }
    });
  }

  openCreateModal() {
    this.editingSchedule = null;
    this.scheduleForm.reset({
      waterPerDay: 0,
      fertilizerPerDay: 0,
      timesPerDay: 1,
      isMorning: false,
      morningTime: '',
      isEvening: false,
      eveningTime: '',
      duration: 10,
      plantId: ''
    });
    this.showModal = true;
  }

  openEditModal(schedule: IrrigationDTO) {
    this.editingSchedule = schedule;
    this.scheduleForm.patchValue(schedule);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.scheduleForm.reset();
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload: IrrigationPayload = {
      waterPerDay: +this.f['waterPerDay'].value,
      fertilizerPerDay: +this.f['fertilizerPerDay'].value,
      timesPerDay: +this.f['timesPerDay'].value,
      isMorning: this.f['isMorning'].value,
      morningTime: this.f['isMorning'].value ? this.f['morningTime'].value : null,
      isEvening: this.f['isEvening'].value,
      eveningTime: this.f['isEvening'].value ? this.f['eveningTime'].value : null,
      duration: +this.f['duration'].value,
      plantId: +this.f['plantId'].value,
    };

    const request$ = this.editingSchedule
      ? this.irrigationTaskService.update(this.editingSchedule.id, payload)
      : this.irrigationTaskService.create(payload);

    request$.subscribe({
      next: (res) => {
        if (this.editingSchedule) {
          const idx = this.schedules.findIndex(s => s.id === this.editingSchedule!.id);
          this.schedules[idx] = res.data;
        } else {
          this.schedules.push(res.data);
        }
        this.notificationService.showSuccess("Schedule saved successfully", 3000);
        this.isSubmitting = false;
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError("Failed to save schedule", 5000);
        this.isSubmitting = false;
      }
    });
  }

  deleteSchedule(id: number) {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    this.irrigationTaskService.deleteTask(id).subscribe({
      next: () => {
        this.schedules = this.schedules.filter(s => s.id !== id);
        this.notificationService.showSuccess("Schedule deleted", 3000);
      },
      error: () => {
        this.notificationService.showError("Failed to delete schedule", 5000);
      }
    });
  }
}
