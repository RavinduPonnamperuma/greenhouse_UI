import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForOf, NgIf, DatePipe, NgClass } from '@angular/common';
import { NotificationService } from '../Utility/notification/notification.service';
import { PolytunnelService } from '../../services/polytunnel.service';
import { PlantService } from '../../services/plant.service';
import { PlantTrayDTO } from '../../interfaces/polytunnel.interface';
import { PlantDto } from '../../interfaces/plant.interface';
import { StatusBadgesComponent } from '../Utility/status-badges/status-badges.component';

interface PlantPayload {
  id?: number;
  plantName: string;
  status: string;
  cost: number;
  harvestTime: number;
  startDate: string;
  endTime: string;
  polytunnelId: number;
}

@Component({
  selector: 'app-plant',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf, StatusBadgesComponent, DatePipe, NgClass],
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss'],
})
export class PlantComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private polytunnelService = inject(PolytunnelService);
  private plantService = inject(PlantService);

  plantForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  polytunnels: PlantTrayDTO[] = [];
  plantDtos: PlantDto[] = [];
  editingPlant: PlantDto | null = null;

  constructor() {
    this.plantForm = this.fb.group({
      plantName: ['', [Validators.required, Validators.minLength(2)]],
      status: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]],
      harvestTime: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endTime: ['', Validators.required],
      polytunnelId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  get f() {
    return this.plantForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.plantForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private loadData(): void {
    Promise.all([this.tunnelGetAll(), this.plantGetAll()]).catch((err) => {
      console.error('Failed to load initial data:', err);
      this.errorMessage = 'Failed to load data. Please try again.';
      this.notificationService.showError(this.errorMessage, 5000);
    });
  }

  private tunnelGetAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.polytunnelService.getAll().subscribe({
        next: (data) => {
          this.polytunnels = Array.isArray(data.data) ? data.data : [data.data];
          resolve();
        },
        error: (err) => {
          console.error('Failed to fetch polytunnels:', err);
          this.errorMessage = 'Failed to load polytunnels.';
          this.notificationService.showError(this.errorMessage, 5000);
          reject(err);
        },
      });
    });
  }

  private plantGetAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.plantService.getAll().subscribe({
        next: (data) => {
          this.plantDtos = Array.isArray(data.data) ? data.data : [data.data];
          resolve();
        },
        error: (err) => {
          console.error('Failed to fetch plants:', err);
          this.errorMessage = 'Failed to load plants.';
          this.notificationService.showError(this.errorMessage, 5000);
          reject(err);
        },
      });
    });
  }

  editPlant(plant: PlantDto): void {
    this.editingPlant = plant;
    this.plantForm.patchValue({
      plantName: plant.plantName,
      status: plant.status,
      cost: plant.cost,
      harvestTime: plant.harvestTime,
      startDate: plant.startDate,
      endTime: plant.endTime,
      polytunnelId: plant.polytunnel.id,
    });
  }

  onSubmit(): void {
    if (this.plantForm.invalid) {
      this.plantForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = this.plantForm.value;
    const payload: PlantPayload = {
      plantName: formValue.plantName,
      status: formValue.status,
      cost: +formValue.cost,
      harvestTime: +formValue.harvestTime,
      startDate: formValue.startDate,
      endTime: formValue.endDate,
      polytunnelId: +formValue.polytunnelId,
    };

    if (this.editingPlant) {
      payload.id = this.editingPlant.id;
    }

    const request = this.editingPlant
      ? this.plantService.updatePlant(this.editingPlant.id!, payload)
      : this.plantService.createPlant(payload);

    request.subscribe({
      next: (data) => {
        this.notificationService.showSuccess(
          this.editingPlant ? 'Plant updated successfully' : 'New plant added successfully',
          3000
        );
        this.plantGetAll();
        this.onReset();
      },
      error: (err) => {
        console.error(`Failed to ${this.editingPlant ? 'update' : 'create'} plant:`, err);
        this.errorMessage = `Failed to ${this.editingPlant ? 'update' : 'add'} plant. Please try again.`;
        this.notificationService.showError(this.errorMessage, 5000);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  deletePlant(id: number): void {
    if (!confirm('Are you sure you want to delete this plant?')) return;

    this.plantService.deletePlant(id).subscribe({
      next: () => {
        this.plantDtos = this.plantDtos.filter((plant) => plant.id !== id);
        this.notificationService.showSuccess('Plant deleted successfully', 3000);
      },
      error: (err) => {
        console.error('Failed to delete plant:', err);
        this.errorMessage = 'Failed to delete plant.';
        this.notificationService.showError(this.errorMessage, 5000);
      },
    });
  }

  onReset(): void {
    this.plantForm.reset({ status: '' });
    this.editingPlant = null;
    this.errorMessage = null;
  }
}
