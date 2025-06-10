import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, NgSwitch} from "@angular/common";
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
    NgSwitch,
    StatusBadgesComponent
  ],
  templateUrl: './polytunnel.component.html',
  styleUrl: './polytunnel.component.scss'
})
export class PolytunnelComponent implements OnInit {

  deviceDTOS:DeviceDTO[]=[]
  polytunnel:PlantTrayDTO[]=[]


  deviceService=inject(DeviceService)
  notificationService=inject(NotificationService)
  polytunnelService=inject(PolytunnelService)

  getAllDevices(): void {
    this.deviceService.getAll().subscribe({
      next: data => {
        this.deviceDTOS=data.data
        console.log(data.data)
      }
    })
  }

  userId=0



  ngOnInit(): void {
    // this.getAllDevices()
    // this.userId = JSON.parse(<string>localStorage.getItem('userId'));
    // console.log(this.userId);
  }

  plotForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
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
    this.getAllDevices();
    this.getAll()
    this.userId = JSON.parse(<string>localStorage.getItem('userId'));
    this.plotForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      // status: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      size: ['', [Validators.required, Validators.minLength(2)]],
      length: ['', [Validators.required, Validators.min(0)]],
      width: ['', [Validators.required, Validators.min(0)]],
      numberOfPlants: ['', [Validators.required, Validators.min(0)]],
      deviceId: ['', Validators.required],
      userId: this.userId,
    });
  }


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
      this.notificationService.showWarning('Please fill the required fields!', 3000);

      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;
    setTimeout(() => {
      const formValue = this.plotForm.value;
      formValue.deviceId = +formValue.deviceId;
      formValue.userId = +formValue.userId;
      formValue.status = 'active';
      this.polytunnelService.create(this.plotForm.value).subscribe({
        next: data => {
          this.notificationService.showSuccess('New poly tunnel added successfully', 3000);
          this.isSubmitting = false;
          console.log(data);
          this.getAll()
        }
      })

    }, 1000);
  }

  getAll(){
    this.polytunnelService.getAll().subscribe({
      next: data => {
        this.polytunnel=data.data
      }
    })
  }
}
