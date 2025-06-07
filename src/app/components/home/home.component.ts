import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';
import { SensorDataService } from '../../services/sensor-data.service';
import { SensorDataDTO } from '../../interfaces/sensor-data.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sensorService = inject(SensorDataService);
  sensorDataDTOS: SensorDataDTO[] = [];
  humidityValues: number[] = [];

  @ViewChild('realtimeChart') realtimeChart: ChartComponent | undefined;
  @ViewChild('waterLevelChart') waterLevelChart: ChartComponent | undefined;
  readonly categories = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];

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
    // Initialize with empty or placeholder series; actual data loads later
    this.lineChartOptions = {
      series: [
        {
          name: 'Humidity',
          data: new Array(this.humidityValues.length).fill(0),
        },
        {
          name: 'Temperature',
          data: [10, 20, 30, 40, 20, 10, 100],
        },
        {
          name: 'Moisture',
          data: [20, 10, 25, 40, 10, 12, 100],
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: this.categories,
        title: {
          text: 'Time',
        },
      },
      title: {
        text: 'Plant Metrics Over Time',
        align: 'left',
        style: {
          color: '#374151',
        },
      },
    };

    this.gaugeChartOptions = {
      series: [75],
      chart: {
        type: 'radialBar',
        height: 350,
        offsetY: -20,
      },
      labels: ['Water Level'],
      title: {
        text: 'Water Tank Level',
        align: 'left',
        style: {
          color: '#374151',
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    };
  }

  ngOnInit() {
    const getLocalHour = (dateString: string): number => {
      return new Date(dateString).getHours();
    };

    const bucketSensorDataByTime = (
      sensorData: SensorDataDTO[],
      categories: string[]
    ): number[] => {
      const buckets: { [key: string]: number[] } = {};
      categories.forEach((cat) => (buckets[cat] = []));

      sensorData.forEach((item) => {
        const hour = getLocalHour(item.createdAt as string);
        const bucketIndex = Math.min(Math.floor(hour / 4), categories.length - 1);
        const bucketLabel = categories[bucketIndex];
        buckets[bucketLabel].push(item.value);
      });

      return categories.map((cat) => {
        const values = buckets[cat];
        if (values.length === 0) return 0;
        const sum = values.reduce((a, b) => a + b, 0);
        return sum / values.length;
      });
    };

    // Fetch humidity sensor data
    this.sensorService.getSensorById('humidity').subscribe((sensor) => {
      this.sensorDataDTOS = sensor.data.map((item: { createdAt: string }) => {
        const localDate = new Date(item.createdAt);
        return {
          ...item,
          createdAtLocal: localDate.toLocaleString(),
          createdAtTime: localDate.toTimeString().slice(0, 5),
        };
      });

      // Bucket data into 4-hour slots and calculate averages for humidity
      this.humidityValues = bucketSensorDataByTime(this.sensorDataDTOS, this.categories);

      // Update the chart series with fresh bucketed humidity data
      this.lineChartOptions.series[0].data = this.humidityValues;

      // Update the chart display
      this.realtimeChart?.updateSeries(this.lineChartOptions.series);

      console.log('Bucketed Humidity Values:', this.humidityValues);
      console.log('Processed Sensor Data:', this.sensorDataDTOS);
    });

    // Existing intervals for random data update on temperature and moisture if you want to keep those
    setInterval(() => {
      const newLive =
        (this.lineChartOptions.series[0].data.slice(-1)[0] as number) +
        Math.floor(Math.random() * 10 - 5);
      const newDead =
        (this.lineChartOptions.series[1].data.slice(-1)[0] as number) +
        Math.floor(Math.random() * 3 - 1);
      const newIncome =
        (this.lineChartOptions.series[2].data.slice(-1)[0] as number) +
        Math.floor(Math.random() * 200 - 100);

      // Uncomment if you want the live update effect on data
      // this.lineChartOptions.series[0].data = [...this.lineChartOptions.series[0].data.slice(1), newLive];
      // this.lineChartOptions.series[1].data = [...this.lineChartOptions.series[1].data.slice(1), newDead];
      // this.lineChartOptions.series[2].data = [...this.lineChartOptions.series[2].data.slice(1), newIncome];

      this.realtimeChart?.updateSeries(this.lineChartOptions.series);
    }, 2000);

    setInterval(() => {
      const newLevel = Math.min(
        100,
        Math.max(0, (this.gaugeChartOptions.series[0] as number) + Math.floor(Math.random() * 10 - 5))
      );
      this.gaugeChartOptions.series = [newLevel];
      this.waterLevelChart?.updateSeries(this.gaugeChartOptions.series);
    }, 3000);
  }
}
