import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('realtimeChart') realtimeChart: ChartComponent | undefined;
  @ViewChild('waterLevelChart') waterLevelChart: ChartComponent | undefined;

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
          name: 'Live Plants',
          data: [1200, 1230, 1245, 1220, 1250, 1260, 1245]
        },
        {
          name: 'Dead Plants',
          data: [20, 22, 23, 21, 24, 22, 23]
        },
        {
          name: 'Income ($)',
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
    setInterval(() => {
      const newLive = (this.lineChartOptions.series[0].data.slice(-1)[0] as number) + Math.floor(Math.random() * 10 - 5);
      const newDead = (this.lineChartOptions.series[1].data.slice(-1)[0] as number) + Math.floor(Math.random() * 3 - 1);
      const newIncome = (this.lineChartOptions.series[2].data.slice(-1)[0] as number) + Math.floor(Math.random() * 200 - 100);

      // this.lineChartOptions.series[0].data = [...this.lineChartOptions.series[0].data.slice(1), newLive];
      // this.lineChartOptions.series[1].data = [...this.lineChartOptions.series[1].data.slice(1), newDead];
      // this.lineChartOptions.series[2].data = [...this.lineChartOptions.series[2].data.slice(1), newIncome];

      this.realtimeChart?.updateSeries(this.lineChartOptions.series);
    }, 2000);

    setInterval(() => {
      const newLevel = Math.min(100, Math.max(0, (this.gaugeChartOptions.series[0] as number) + Math.floor(Math.random() * 10 - 5)));
      this.gaugeChartOptions.series = [newLevel];
      this.waterLevelChart?.updateSeries(this.gaugeChartOptions.series);
    }, 3000);
  }
}
