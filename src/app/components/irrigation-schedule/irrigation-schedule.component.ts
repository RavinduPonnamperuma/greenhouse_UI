import {Component, inject} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PlantService} from "../../services/plant.service";
import {IrrigationService} from "../../services/irrigation.service";
import {PlantDto} from "../../interfaces/plant.interface";
import {IrrigationDTO} from "../../interfaces/irrigation.entity";
import {NotificationService} from "../Utility/notification/notification.service";
import {IrrigationTaskService} from "../../services/IrrigationTask.service";
import {PlantTaskDto} from "../../interfaces/irrigation-task.entity";


interface IrrigationTask {
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
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './irrigation-schedule.component.html',
  styleUrl: './irrigation-schedule.component.scss'
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
    this.getAllTasks();
    this.getAllPlants();
    this.getAllIrrigations();
  }

  get f() {
    return this.taskForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.taskForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getAllPlants() {
    this.plantService.getAll().subscribe({
      next: (response) => {
        this.plants = Array.isArray(response.data) ? response.data : [response.data];
      },
      error: (err) => {
        console.error('Failed to fetch plants:', err);
        this.errorMessage = 'Failed to load plant data.';
        this.notificationService.showError('Failed to load plant data.', 5000);
      },
    });
  }

  getAllIrrigations() {
    this.irrigationService.getAll().subscribe({
      next: (response) => {
        this.irrigations = Array.isArray(response.data) ? response.data : [response.data];
      },
      error: (err) => {
        console.error('Failed to fetch irrigations:', err);
        this.errorMessage = 'Failed to load irrigation schedules.';
        this.notificationService.showError('Failed to load irrigation schedules.', 5000);
      },
    });
  }

  getAllTasks() {
    this.irrigationTaskService.getAll().subscribe({
      next: (response) => {
        this.tasks = Array.isArray(response.data) ? response.data : [response.data];
      },
      error: (err) => {
        console.error('Failed to fetch tasks:', err);
        this.errorMessage = 'Failed to load irrigation tasks.';
        this.notificationService.showError('Failed to load irrigation tasks.', 5000);
      },
    });
  }

  openCreateModal() {
    this.editingTask = null;
    this.taskForm.reset();
    this.showModal = true;
  }

  openEditModal(task: PlantTaskDto) {
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

  closeModal() {
    this.showModal = false;
    this.taskForm.reset();
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload: IrrigationTask = {
      scheduledDate: this.taskForm.value.scheduledDate,
      scheduledTime: this.taskForm.value.scheduledTime,
      taskType: this.taskForm.value.taskType,
      duration: +this.taskForm.value.duration,
      plantId: +this.taskForm.value.plantId,
      irrigationId: +this.taskForm.value.irrigationId,
    };



    this.irrigationTaskService.create(payload).subscribe({
      next: (response) => {
        const message = this.editingTask
          ? 'Irrigation task updated successfully'
          : 'Irrigation task added successfully';
        this.notificationService.showSuccess(message, 3000);

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
        console.error('Failed to save task:', err);
        const message = this.editingTask
          ? 'Failed to update irrigation task.'
          : 'Failed to add irrigation task.';
        this.notificationService.showError(message + ' Please try again.', 5000);
        this.errorMessage = message;
        this.isSubmitting = false;
      },
    });
  }

  deleteTask(id: number) {
    if (!confirm('Are you sure you want to delete this irrigation task?')) return;

    this.irrigationTaskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.notificationService.showSuccess('Irrigation task deleted successfully', 3000);
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
        this.notificationService.showError('Failed to delete irrigation task.', 5000);
        this.errorMessage = 'Failed to delete irrigation task.';
      },
    });
  }

  getPlantName(plantId: number): string {
    const plant = this.plants.find((p) => p.id === plantId);
    return plant ? plant.plantName : 'Unknown';
  }
}
