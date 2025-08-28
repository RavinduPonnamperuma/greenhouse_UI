import { Component, inject } from '@angular/core';
import {NgForOf, NgIf, DatePipe, NgClass, TitleCasePipe} from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantService } from '../../services/plant.service';
import { IrrigationService } from '../../services/irrigation.service';
import { NotificationService } from '../Utility/notification/notification.service';
import { PlantDto } from '../../interfaces/plant.interface';
import { IrrigationDTO } from '../../interfaces/irrigation.entity';
import { PlantTaskDto } from '../../interfaces/irrigation-task.entity';
import {IrrigationTaskService} from "../../services/IrrigationTask.service";

interface IrrigationTaskPayload {
  scheduledDate: string;
  scheduledTime: string;
  taskType: string;
  duration: number;
  plantId: number;
  irrigationId: number;
}

@Component({
  selector: 'app-irrigation-schedule',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule, NgClass, DatePipe, TitleCasePipe],
  templateUrl: './irrigation-schedule.component.html',
  styleUrls: ['./irrigation-schedule.component.scss'],
})
export class IrrigationScheduleComponent {
  private plantService = inject(PlantService);
  private irrigationService = inject(IrrigationService);
  private notificationService = inject(NotificationService);
  private irrigationTaskService = inject(IrrigationTaskService);
  private fb = inject(FormBuilder);

  taskForm: FormGroup;
  tasks: PlantTaskDto[] = [];
  plants: PlantDto[] = [];
  irrigations: IrrigationDTO[] = [];
  isSubmitting = false;
  errorMessage: string | null = null;
  showModal = false;
  editingTask: PlantTaskDto | null = null;

  constructor() {
    this.taskForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      taskType: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      plantId: ['', Validators.required],
      irrigationId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  get f() {
    return this.taskForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.taskForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private loadData(): void {
    Promise.all([
      this.getAllPlants(),
      this.getAllIrrigations(),
      this.getAllTasks(),
    ]).catch((err) => {
      console.error('Failed to load initial data:', err);
      this.errorMessage = 'Failed to load data. Please try again.';
      this.notificationService.showError(this.errorMessage, 5000);
    });
  }

  private getAllPlants(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.plantService.getAll().subscribe({
        next: (response) => {
          this.plants = Array.isArray(response.data) ? response.data : [response.data];
          resolve();
        },
        error: (err) => {
          console.error('Failed to fetch plants:', err);
          this.errorMessage = 'Failed to load plant data.';
          this.notificationService.showError(this.errorMessage, 5000);
          reject(err);
        },
      });
    });
  }

  private getAllIrrigations(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.irrigationService.getAll().subscribe({
        next: (response) => {
          this.irrigations = Array.isArray(response.data) ? response.data : [response.data];
          resolve();
        },
        error: (err) => {
          console.error('Failed to fetch irrigations:', err);
          this.errorMessage = 'Failed to load irrigation schedules.';
          this.notificationService.showError(this.errorMessage, 5000);
          reject(err);
        },
      });
    });
  }

  private getAllTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.irrigationTaskService.getAll().subscribe({
        next: (response) => {
          this.tasks = Array.isArray(response.data) ? response.data : [response.data];
          resolve();
        },
        error: (err) => {
          console.error('Failed to fetch tasks:', err);
          this.errorMessage = 'Failed to load irrigation tasks.';
          this.notificationService.showError(this.errorMessage, 5000);
          reject(err);
        },
      });
    });
  }

  openCreateModal(): void {
    this.editingTask = null;
    this.taskForm.reset();
    this.showModal = true;
  }

  openEditModal(task: PlantTaskDto): void {
    this.editingTask = task;
    this.taskForm.patchValue({
      scheduledDate: task.scheduledDate,
      scheduledTime: task.scheduledTime,
      taskType: task.taskType,
      duration: task.duration,
      plantId: task.plant.id,
      irrigationId: task.irrigation.id,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.taskForm.reset();
    this.errorMessage = null;
    this.editingTask = null;
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload: IrrigationTaskPayload = {
      scheduledDate: this.taskForm.value.scheduledDate,
      scheduledTime: this.taskForm.value.scheduledTime,
      taskType: this.taskForm.value.taskType,
      duration: +this.taskForm.value.duration,
      plantId: +this.taskForm.value.plantId,
      irrigationId: +this.taskForm.value.irrigationId,
    };

    const request = this.editingTask
      ? this.irrigationTaskService.update(this.editingTask.id, payload)
      : this.irrigationTaskService.create(payload);

    request.subscribe({
      next: (response) => {
        this.notificationService.showSuccess(
          `Irrigation task ${this.editingTask ? 'updated' : 'added'} successfully`,
          3000
        );
        if (this.editingTask) {
          const index = this.tasks.findIndex((t) => t.id === this.editingTask!.id);
          this.tasks[index] = response.data;
        } else {
          this.tasks.push(response.data);
        }
        this.isSubmitting = false;
        this.closeModal();
      },
      error: (err) => {
        console.error(`Failed to ${this.editingTask ? 'update' : 'create'} task:`, err);
        this.errorMessage = `Failed to ${this.editingTask ? 'update' : 'add'} irrigation task. Please try again.`;
        this.notificationService.showError(this.errorMessage, 5000);
        this.isSubmitting = false;
      },
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Are you sure you want to delete this irrigation task?')) return;

    this.irrigationTaskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.notificationService.showSuccess('Irrigation task deleted successfully', 3000);
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
        this.errorMessage = 'Failed to delete irrigation task.';
        this.notificationService.showError(this.errorMessage, 5000);
      },
    });
  }
}
