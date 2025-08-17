import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent
} from 'ng-apexcharts';
import {SensorDataService} from "../../services/sensor-data.service";
import {DashboardMetricsDto, SensorDataDTO} from "../../interfaces/sensor-data.interface";
import {ActionService} from "../../services/action.service";
import {NotificationService} from "../Utility/notification/notification.service";

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

  temperatures: { timestamp: string; value: number }[] = [];
  humidities: { timestamp: string; value: number }[] = [];
  moistures: { timestamp: string; value: number }[] = [];

  dashboardMetricsDtos: DashboardMetricsDto[] = []

  constructor() {
    this.getDashBordData();
    this.lineChartOptions = {
      series: [
        {
          name: 'Humidity',
          data: []
        },
        {
          name: 'Moisture',
          data: []
        },
        {
          name: 'Temperature',
          data: []
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
        categories: [], // Start with empty categories
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

    // Initial data fetch
    this.fetchSensorData();
    this.getWaterLevel();

    // Real-time updates for sensor data
    setInterval(() => {
      this.fetchSensorData();
    }, 20000);

    // Real-time updates for water level
    setInterval(() => {
      this.getWaterLevel();
    }, 20000);
  }

  turnOn(name: string, id: number) {
    this.actionService.turnOn(String(id)).subscribe({
      next: (data: any) => {
        this.notificationService.showSuccess(`Successfully turned on the ${name}`, 3000);
      },
      error: (err) => {
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

  turnOff(name: string, id: number) {
    this.actionService.turnOff(String(id)).subscribe({
      next: (data: any) => {
        this.notificationService.showSuccess(`Successfully turned off the ${name}`, 3000);
      },
      error: (err) => {
        console.error('Failed to turn off:', err);
        this.notificationService.showError(`Failed to turn off the ${name}`, 3000);
      }
    });
  }

  //  filter data by 5-minute intervals
  private filterByMinuteIntervals(data: { timestamp: string; value: number }[]): {
    timestamp: string;
    value: number
  }[] {
    if (data.length === 0) return [];

    const filtered: { timestamp: string; value: number }[] = [];
    let lastTimestamp: Date | null = null;

    for (const item of data) {
      const currentTimestamp = new Date(item.timestamp);

      if (!lastTimestamp ||
        currentTimestamp.getTime() - lastTimestamp.getTime() >= 5 * 60 * 1000) { // 30 minutes in milliseconds
        filtered.push(item);
        lastTimestamp = currentTimestamp;
      }
    }

    return filtered;
  }

  fetchSensorData() {
    this.sensorDataService.getSensorById('all').subscribe({
      next: (data: any) => {
        const sensorData: SensorDataDTO[] = data.data;

        // Get and sort all sensor data
        const allTemperatures = sensorData
          .filter(item => item.topic === 'temperature')
          .map(item => ({value: item.value, timestamp: item.createdAt}))
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const allHumidities = sensorData
          .filter(item => item.topic === 'humidity')
          .map(item => ({value: item.value, timestamp: item.createdAt}))
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const allMoistures = sensorData
          .filter(item => item.topic === 'moisture')
          .map(item => ({value: item.value, timestamp: item.createdAt}))
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        // Filter to show only 30-minute intervals
        this.temperatures = this.filterByMinuteIntervals(allTemperatures);
        this.humidities = this.filterByMinuteIntervals(allHumidities);
        this.moistures = this.filterByMinuteIntervals(allMoistures);

        // Format timestamps for better display
        const formatTimestamp = (timestamp: string) => {
          const date = new Date(timestamp);
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        };

        // Update series data
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

        // Update xaxis categories with formatted timestamps
        // Use temperatures array as reference for timestamps (assuming all sensors have same timestamps)
        this.lineChartOptions.xaxis.categories = this.temperatures.map(item =>
          formatTimestamp(item.timestamp)
        );

        // Update the chart with new data
        if (this.realtimeChart) {
          this.realtimeChart.updateOptions({
            series: this.lineChartOptions.series,
            xaxis: this.lineChartOptions.xaxis
          });
        }
      },
      error: (err) => {
        console.error('Error fetching sensor data:', err);
        this.notificationService.showError('Failed to fetch sensor data', 3000);
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

        // Update chart if it exists
        if (this.waterLevelChart) {
          this.waterLevelChart.updateSeries(this.gaugeChartOptions.series);
        }

        if (percentage < 10) {
          this.notificationService.showWarning('Water level is below 10%!', 5000);
        } else if (percentage >= 10 && percentage <= 50) {
          this.notificationService.showWarning('Water level is between 10% and 50%.', 5000);
        }
      },
      error: (err) => {
        console.error('Error fetching water tank data:', err);
        this.notificationService.showError('Failed to fetch water tank data', 3000);
      }
    });
  }


  getDashBordData() {
    this.sensorDataService.getDashBoardData().subscribe(
      {
        next: (data: any) => {
          this.dashboardMetricsDtos = data.data;
          console.log(this.dashboardMetricsDtos)
        }
      }
    )
  }
}
