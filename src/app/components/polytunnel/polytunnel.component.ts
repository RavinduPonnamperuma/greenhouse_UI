import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-polytunnel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './polytunnel.component.html',
  styleUrl: './polytunnel.component.scss'
})
export class PolytunnelComponent implements OnInit {
  plotForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
  ];
  devices = [
    { id: 1, name: 'Device 001' },
    { id: 2, name: 'Device 002' },
    { id: 3, name: 'Device 003' },
  ];
  tableData = [
    { code: 'PT-001', status: 'Active', location: 'Field A', size: '100 sqm' },
    { code: 'PT-002', status: 'Inactive', location: 'Row B', size: '600 sqm' },
    { code: 'PT-003', status: 'Active', location: 'Field C', size: '450 sqm' },
    { code: 'PT-004', status: 'Maintenance', location: 'Field D', size: '300 sqm' },
  ];

  constructor(private fb: FormBuilder) {
    this.plotForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      size: ['', [Validators.required, Validators.minLength(2)]],
      length: ['', [Validators.required, Validators.min(0)]],
      width: ['', [Validators.required, Validators.min(0)]],
      numberOfPlants: ['', [Validators.required, Validators.min(0)]],
      userId: ['', Validators.required],
      deviceId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.plotForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.plotForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.plotForm.invalid) {
      this.plotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', this.plotForm.value);
      this.isSubmitting = false;
      // Reset form or handle success as needed
    }, 1000);
  }
}
