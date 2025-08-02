import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyPipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {PlantService} from "../../services/plant.service";
import {NotificationService} from "../Utility/notification/notification.service";
import {HarvestService} from "../../services/harvest.service";
import {PlantDto} from "../../interfaces/plant.interface";
import {HarvestDTO} from "../../interfaces/harverst.entity";

export interface Harvest {
  harvestDate: string;
  sellingPrice: number;
  quantity: number;
  variety: string;
  plantId: number;
}

interface HarvestDTOs extends Harvest {
  id: number;
  plant: PlantDto;
}

@Component({
  selector: 'app-harvest',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './harvest.component.html',
  styleUrl: './harvest.component.scss'
})
export class HarvestComponent implements OnInit {
  private plantService = inject(PlantService);
  private harvestService = inject(HarvestService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  todayData=''

  harvestForm: FormGroup;
  harvests: HarvestDTO[] = [];
  plants: PlantDto[] = [];
  isSubmitting = false;
  errorMessage: string | null = null;
  editingHarvest: HarvestDTO | null = null;

  constructor() {
    this.harvestForm = this.fb.group({
      sellingPrice: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      variety: ['', [Validators.required, Validators.minLength(2)]],
      plantId: ['', Validators.required],
    });
    this.todayData = new Date().toISOString().split('T')[0];
    // console.log(todayData)
  }

  ngOnInit(): void {
    this.getAllHarvests();
    this.getAllPlants();
  }

  get f() {
    return this.harvestForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.harvestForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  pastOrTodayValidator(control: import('@angular/forms').AbstractControl) {
    const today = new Date().toISOString().split('T')[0];
    return control.value <= today ? null : { futureDate: true };
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

  getAllHarvests() {
    this.harvestService.getAll().subscribe({
      next: (response) => {
        this.harvests = Array.isArray(response.data) ? response.data : [response.data];
      },
      error: (err) => {
        console.error('Failed to fetch harvests:', err);
        this.errorMessage = 'Failed to load harvest records.';
        this.notificationService.showError('Failed to load harvest records.', 5000);
      },
    });
  }

  onSubmit() {
    if (this.harvestForm.invalid) {
      this.harvestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const plantId = +this.harvestForm.value.plantId;
    const plant = this.plants.find(p => p.id === plantId);
    const varietyDescriptor = this.harvestForm.value.variety;
    const variety = plant ? `${plant.plantName} - ${varietyDescriptor}` : varietyDescriptor;

    const payload: Harvest = {
      harvestDate: this.todayData,
      sellingPrice: +this.harvestForm.value.sellingPrice,
      quantity: +this.harvestForm.value.quantity,
      variety: variety,
      plantId: plantId,
    };

    this.harvestService.create(payload).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Harvest record added successfully', 3000);
        this.harvests.push(response.data);
        this.isSubmitting = false;
        this.harvestForm.reset();
      },
      error: (err) => {
        console.error('Failed to add harvest:', err);
        this.notificationService.showError('Failed to add harvest record. Please try again.', 5000);
        this.errorMessage = 'Failed to add harvest record.';
        this.isSubmitting = false;
      },
    });
  }

  clearForm() {
    this.harvestForm.reset();
    this.errorMessage = null;
  }
}
