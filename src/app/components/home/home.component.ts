import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';
import { SensorDataService } from "../../services/sensor-data.service";
import { HumidityDTO, MoistureDTO, SensorDataDTO, TemperatureDTO } from "../../interfaces/sensor-data.interface";
import { ActionService } from "../../services/action.service";
import { NotificationService } from "../Utility/notification/notification.service";

export interface WaterTankLevelDto {
  waterTankId: number;
  tankNumber: string;
  totalCapacity: number;
  totalOut: string;
  currentWaterLevel: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartComponent,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('realtimeChart') realtimeChart: ChartComponent | undefined;
  @ViewChild('waterLevelChart') waterLevelChart: ChartComponent | undefined;

  fanChecked: boolean = false;
  waterChecked: boolean = false;
  fertilizerChecked: boolean = false;

  sensorDataService = inject(SensorDataService);
  notificationService = inject(NotificationService);
  actionService = inject(ActionService);

  public lineChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
  };
  public gaugeChartOptions: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    title: ApexTitleSubtitle;
    responsive: ApexResponsive[];
  };

  constructor() {
    this.lineChartOptions = {
      series: [
        {
          name: 'Humidity',
          data: [1200, 1230, 1245, 1220, 1250, 1260, 1245]
        },
        {
          name: 'Moisture',
          data: [20, 22, 23, 21, 24, 22, 23]
        },
        {
          name: 'Temperature',
          data: [11500, 11650, 12000, 11900, 12100, 12300, 12450]
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'],
        title: {
          text: 'Time'
        }
      },
      title: {
        text: 'Plant Metrics Over Time',
        align: 'left',
        style: {
          color: '#374151'
        }
      }
    };

    this.gaugeChartOptions = {
      series: [75],
      chart: {
        type: 'radialBar',
        height: 350,
        offsetY: -20
      },
      labels: ['Water Level'],
      title: {
        text: 'Water Tank Level',
        align: 'left',
        style: {
          color: '#374151'
        }
      },
      responsive: [{
        breakpoint: 640,
        options: {
          chart: {
            height: 300
          }
        }
      }]
    };
  }

  ngOnInit() {
    this.temperatures = [];
    this.humidities = [];
    this.moistures = [];
    setInterval(() => {
      const newLive = (this.lineChartOptions.series[0].data.slice(-1)[0] as number) + Math.floor(Math.random() * 10 - 5);
      const newDead = (this.lineChartOptions.series[1].data.slice(-1)[0] as number) + Math.floor(Math.random() * 3 - 1);
      const newIncome = (this.lineChartOptions.series[2].data.slice(-1)[0] as number) + Math.floor(Math.random() * 200 - 100);

      this.realtimeChart?.updateSeries(this.lineChartOptions.series);
    }, 2000);

    setInterval(() => {
      this.getWaterLevel();
    }, 3000);

    setInterval(() => {
      this.fetchSensorData();
    }, 10000);
  }

  turnOn(name: string, id: number) {
    this.actionService.turnOn(String(id)).subscribe({
      next: (data: any) => {
      },
      error: (err) => {
        console.error('Failed to turn on:', err);
        this.notificationService.showError(`Failed to turn on the ${name}`, 3000);
      }
    });
  }

  toggleDevice(name: string, id: number, isChecked: boolean) {
    if (isChecked) {
      this.turnOn(name, id);
    } else {
      this.turnOff(name, id);
    }
  }

  private revertCheckboxState(name: string, revertTo: boolean) {
    if (name === 'Fan') {
      this.fanChecked = revertTo;
    } else if (name === 'Water') {
      this.waterChecked = revertTo;
    } else if (name === 'Fertilizer') {
      this.fertilizerChecked = revertTo;
    }
  }

  turnOff(name: string, id: number) {
    this.actionService.turnOff(String(id)).subscribe({
      next: (data: any) => {
      },
      error: (err) => {
        console.error('Failed to turn off:', err);
        this.notificationService.showError(`Failed to turn off the ${name}`, 3000);
      }
    });
  }

  temperatures: { timestamp: string; value: number }[] = [];
  humidities: { timestamp: string; value: number }[] = [];
  moistures: { timestamp: string; value: number }[] = [];

  fetchSensorData() {
    this.sensorDataService.getSensorById('all').subscribe({
      next: (data: any) => {
        const sensorData: SensorDataDTO[] = data.data;

        this.temperatures = sensorData
          .filter(item => item.topic === 'temperature')
          .map(item => ({ value: item.value, timestamp: item.createdAt }));
        this.humidities = sensorData
          .filter(item => item.topic === 'humidity')
          .map(item => ({ value: item.value, timestamp: item.createdAt }));
        this.moistures = sensorData
          .filter(item => item.topic === 'moisture')
          .map(item => ({ value: item.value, timestamp: item.createdAt }));
        this.lineChartOptions.series = [
          {
            name: 'Humidity',
            data: this.humidities.map(item => item.value)
          },
          {
            name: 'Moisture',
            data: this.moistures.map(item => item.value)
          },
          {
            name: 'Temperature',
            data: this.temperatures.map(item => item.value)
          }
        ];
        this.lineChartOptions.xaxis.categories = this.temperatures.map(item => item.timestamp);
      },
      error: (err) => {
        console.error('Error fetching sensor data:', err);
      }
    });
  }

  getWaterLevel() {
    this.sensorDataService.getWaterTank(1).subscribe({
      next: (data: any) => {
        const waterTank: WaterTankLevelDto = data.data;
        const currentLevel = parseFloat(waterTank.currentWaterLevel);
        const totalCapacity = waterTank.totalCapacity;
        const percentage = Math.round((currentLevel / totalCapacity) * 100);
        this.gaugeChartOptions.series = [percentage];
        this.waterLevelChart?.updateSeries(this.gaugeChartOptions.series);
      },
      error: (err) => {
        console.error('Error fetching water tank data:', err);
        this.notificationService.showError('Failed to fetch water tank data', 3000);
      }
    });
  }
}
