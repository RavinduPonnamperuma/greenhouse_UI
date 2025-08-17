import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {DeviceService} from "../../services/device.service";
import {DeviceDTO} from "../../interfaces/device.interface";
import {NotificationService} from "../Utility/notification/notification.service";
import {PolytunnelService} from "../../services/polytunnel.service";
import {PlantTrayDTO} from "../../interfaces/polytunnel.interface";
import {StatusBadgesComponent} from "../Utility/status-badges/status-badges.component";

@Component({
  selector: 'app-polytunnel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    StatusBadgesComponent
  ],
  templateUrl: './polytunnel.component.html',
  styleUrl: './polytunnel.component.scss'
})
export class PolytunnelComponent implements OnInit {
  deviceDTOS: DeviceDTO[] = [];
  polytunnel: PlantTrayDTO[] = [];

  deviceService = inject(DeviceService);
  notificationService = inject(NotificationService);
  polytunnelService = inject(PolytunnelService);

  userId = 0;
  editingId: number | null = null;

  plotForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.userId = JSON.parse(<string>localStorage.getItem('userId'));
    this.plotForm = this.fb.group({
      code: ['PT-', [Validators.required, Validators.minLength(3), Validators.pattern(/^PT-.+/)]],
      status: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(2)]],
      size: ['', [Validators.required, Validators.minLength(2)]],
      length: ['', [Validators.required, Validators.min(0)]],
      width: ['', [Validators.required, Validators.min(0)]],
      numberOfPlants: ['', [Validators.required, Validators.min(0)]],
      deviceId: ['', Validators.required],
      userId: this.userId
    });
  }

  ngOnInit(): void {
    this.getAllDevices();
    this.getAll();
  }

  get f() {
    return this.plotForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.plotForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getAllDevices(): void {
    this.deviceService.getAll().subscribe({
      next: data => {
        this.deviceDTOS = data.data;
      }
    });
  }

  getAll(): void {
    this.polytunnelService.getAll().subscribe({
      next: data => {
        this.polytunnel = data.data;
      }
    });
  }

  onEdit(row: PlantTrayDTO): void {
    this.editingId = row.id;
    this.plotForm.patchValue({
      code: row.code,
      status: row.status,
      location: row.location,
      size: row.size,
      length: row.length,
      width: row.width,
      numberOfPlants: row.numberOfPlants,
      userId: this.userId
    });
    this.plotForm.get('deviceId')?.disable();
  }

  onCancel(): void {
    this.editingId = null;
    this.plotForm.reset({ code: 'PT-', userId: this.userId });
    this.plotForm.get('deviceId')?.enable();
  }

  onSubmit(): void {
    if (this.plotForm.invalid) {
      this.plotForm.markAllAsTouched();
      this.notificationService.showWarning('Please fill the required fields!', 3000);
      return;
    }

    this.isSubmitting = true;
    const formValue = this.plotForm.getRawValue();

    if (this.editingId) {
      const updatePayload = {
        code: formValue.code,
        status: formValue.status,
        location: formValue.location,
        size: formValue.size,
        length: +formValue.length,
        width: +formValue.width,
        numberOfPlants: formValue.numberOfPlants
      };

      this.polytunnelService.update(this.editingId, updatePayload).subscribe({
        next: () => {
          this.notificationService.showSuccess('Polytunnel updated successfully', 3000);
          this.isSubmitting = false;
          this.onCancel();
          this.getAll();
        },
        error: () => {
          this.isSubmitting = false;
          this.notificationService.showError('Failed to update polytunnel', 3000);
        }
      });
    } else {
      const createPayload = {
        ...formValue,
        deviceId: +formValue.deviceId,
        userId: +formValue.userId
      };

      this.polytunnelService.create(createPayload).subscribe({
        next: () => {
          this.notificationService.showSuccess('New polytunnel added successfully', 3000);
          this.isSubmitting = false;
          this.plotForm.reset({ code: 'PT-', userId: this.userId });
          this.getAll();
        },
        error: () => {
          this.isSubmitting = false;
          this.notificationService.showError('Failed to create polytunnel', 3000);
        }
      });
    }
  }
}
