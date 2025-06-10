import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";



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
export class IrrigationComponent implements OnInit {
  irrigationForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  plants = [
    { id: 1, name: 'Tomato' },
    { id: 2, name: 'Cucumber' },
    { id: 3, name: 'Lettuce' },
  ];
  tableData: Irrigation[] = [
    {
      waterPerDay: 2.5,
      fertilizerPerDay: 1.5,
      timesPerDay: 3,
      isMorning: 0,
      morningTime: '06:30',
      isEvening: 0,
      eveningTime: '18:30',
      duration: 15,
      plantId: 2,
    },
    {
      waterPerDay: 3.0,
      fertilizerPerDay: 1.0,
      timesPerDay: 2,
      isMorning: 1,
      morningTime: '07:00',
      isEvening: 1,
      eveningTime: '19:00',
      duration: 20,
      plantId: 1,
    },
  ];

  constructor(private fb: FormBuilder) {
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

  ngOnInit(): void {}

  get f() {
    return this.irrigationForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.irrigationForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getPlantName(plantId: number): string {
    const plant = this.plants.find(p => p.id === plantId);
    return plant ? plant.name : 'Unknown';
  }

  onSubmit(): void {
    if (this.irrigationForm.invalid) {
      this.irrigationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue: Irrigation = this.irrigationForm.value;
    console.log('Form submitted:', formValue);

    // Simulate form submission
    setTimeout(() => {
      this.tableData.push({
        ...formValue,
        waterPerDay: +formValue.waterPerDay,
        fertilizerPerDay: +formValue.fertilizerPerDay,
        timesPerDay: +formValue.timesPerDay,
        isMorning: +formValue.isMorning,
        isEvening: +formValue.isEvening,
        duration: +formValue.duration,
        plantId: +formValue.plantId,
      });
      this.isSubmitting = false;
      this.irrigationForm.reset();
    }, 1000);
  }
}
