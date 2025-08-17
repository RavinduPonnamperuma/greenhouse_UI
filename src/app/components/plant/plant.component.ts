import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ChartComponent} from "ng-apexcharts";
import {NotificationService} from "../Utility/notification/notification.service";
import {PolytunnelService} from "../../services/polytunnel.service";
import {PlantTrayDTO} from "../../interfaces/polytunnel.interface";
import {PlantService} from "../../services/plant.service";
import {PlantDto} from "../../interfaces/plant.interface";
import {StatusBadgesComponent} from "../Utility/status-badges/status-badges.component";

@Component({
  selector: 'app-plant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    ChartComponent,
    StatusBadgesComponent
  ],
  templateUrl: './plant.component.html',
  styleUrl: './plant.component.scss'
})
export class PlantComponent implements OnInit {
  plantForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  polytunnel:PlantTrayDTO[]=[]
  plantDtos:PlantDto[]=[]

  notificationService=inject(NotificationService)
  polytunnelService=inject(PolytunnelService)
  plantService=inject(PlantService)

  constructor(private fb: FormBuilder) {
   this.tunnelGetAll();
    this.plantGetAll();
    this.plantForm = this.fb.group({
      plantName: ['', [Validators.required, Validators.minLength(2)]],
      status: 'active',
      cost: ['', [Validators.required, Validators.min(0)]],
      harvestTime: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endTime: ['', Validators.required],
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
    setTimeout(() => {
      const formValue = this.plantForm.value;
      formValue.polytunnelId = +formValue.polytunnelId;
      this.plantService.createPlant(this.plantForm.value).subscribe({
        next: data => {
          this.notificationService.showSuccess('New plant added successfully', 3000);
          this.isSubmitting = false;
          console.log(data);
          this.plantGetAll();
        }
      })

    }, 1000);
  }

  tunnelGetAll(){
    this.polytunnelService.getAll().subscribe({
      next: data => {
        this.polytunnel=data.data
      }
    })
  }


  plantGetAll(){
    this.plantService.getAll().subscribe({
      next: data => {
        this.plantDtos=data.data
      }
    })
  }
}
