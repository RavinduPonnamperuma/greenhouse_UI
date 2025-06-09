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
  users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
  ];
  devices = [
    { id: 1, name: 'Device 1' },
    { id: 2, name: 'Device 2' },
    { id: 3, name: 'Device 3' },
  ];


  constructor(private fb: FormBuilder) {
    this.plotForm = this.fb.group({
      code: ['PT-003', Validators.required],
      status: ['active', Validators.required],
      location: ['Greenhouse Section A', Validators.required],
      size: ['Large', Validators.required],
      length: [30, [Validators.required, Validators.min(0)]],
      width: [15, [Validators.required, Validators.min(0)]],
      numberOfPlants: [200, [Validators.required, Validators.min(0)]],
      userId: [2, Validators.required],
      deviceId: [3, Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.plotForm.valid) {
      console.log('Form submitted:', this.plotForm.value);
    }
  }
}
