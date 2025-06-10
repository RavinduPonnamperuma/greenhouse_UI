import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";



interface Harvest {
  harvestDate: string;
  sellingPrice: number;
  quantity: number;
  variety: string;
  plantId: number;
}

@Component({
  selector: 'app-harvest',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CurrencyPipe
  ],
  templateUrl: './harvest.component.html',
  styleUrl: './harvest.component.scss'
})
export class HarvestComponent implements OnInit {
  harvestForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  plants = [
    { id: 1, name: 'Apple Tree' },
    { id: 2, name: 'Orange Tree' },
    { id: 3, name: 'Grape Vine' },
  ];
  tableData: Harvest[] = [
    {
      harvestDate: '2025-06-10',
      sellingPrice: 120.5,
      quantity: 250.75,
      variety: 'Apple',
      plantId: 1,
    },
    {
      harvestDate: '2025-05-15',
      sellingPrice: 80.25,
      quantity: 300.5,
      variety: 'Orange',
      plantId: 2,
    },
  ];

  constructor(private fb: FormBuilder) {
    this.harvestForm = this.fb.group({
      harvestDate: ['', Validators.required],
      sellingPrice: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      variety: ['', [Validators.required, Validators.minLength(2)]],
      plantId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.harvestForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.harvestForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getPlantName(plantId: number): string {
    const plant = this.plants.find(p => p.id === plantId);
    return plant ? plant.name : 'Unknown';
  }

  onSubmit(): void {
    if (this.harvestForm.invalid) {
      this.harvestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue: Harvest = this.harvestForm.value;
    console.log('Form submitted:', formValue);

    // Simulate form submission
    setTimeout(() => {
      this.tableData.push(formValue);
      this.isSubmitting = false;
      this.harvestForm.reset();
    }, 1000);
  }
}
