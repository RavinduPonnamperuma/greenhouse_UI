import {Component, OnInit} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {SensorDataService} from "../../services/sensor-data.service";

@Component({
  selector: 'app-home',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showLoginForm: boolean = false;
  sensorData: any;
  lastSensorData:any;

  constructor(private router: Router,private sensorDataService: SensorDataService) {}
  ngOnInit(): void {
    // this.loadSensorData();
    this.fetchLastSensorData();

  }

  loadSensorData(): void {
    this.sensorDataService.getAllSensorData().subscribe((data) => {
      this.sensorData = data;
      // console.log(data);
    });
  }
  toggleRegisterForm(): void {
    this.router.navigate(['/register']);
  }

  fetchLastSensorData(): void {
    this.sensorDataService.getLastSensorData().subscribe(
      (data: any) => {
        this.sensorData = data; // Store the last data in the component
        console.log(data); // For debugging
      },
      (error: any) => {
        console.error('Error fetching last sensor data:', error); // Handle error
      }
    );
  }





}



