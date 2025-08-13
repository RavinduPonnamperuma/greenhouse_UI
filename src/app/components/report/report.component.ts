import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { PlantService } from '../../services/plant.service';
import { PolytunnelService } from '../../services/polytunnel.service';
import { ReportsService } from '../../services/reports.service';
import { PlantTrayDTO } from '../../interfaces/polytunnel.interface';
import { PlantDto } from '../../interfaces/plant.interface';
import { saveAs } from 'file-saver';
import { Observable, map } from 'rxjs';
import * as XLSX from 'xlsx';
import {exportToCSV} from "../../../core/util/util";

interface ReportForm {
  startDate: string;
  endDate: string;
  plantId: string;
  plotId: string;
  reportType: string;
}


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf, NgClass],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [DatePipe],
})
export class ReportComponent implements OnInit {
  private plantService = inject(PlantService);
  private polytunnelService = inject(PolytunnelService);
  private reportsService = inject(ReportsService);
  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  polytunnels: PlantTrayDTO[] = [];
  plants: PlantDto[] = [];
  reportForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor() {
    this.reportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      plantId: [''],
      plotId: [''],
      reportType: ['', Validators.required],
    });

    this.tunnelGetAll();
    this.plantGetAll();
  }

  ngOnInit(): void {}

  tunnelGetAll(): void {
    this.polytunnelService.getAll().subscribe({
      next: (data) => {
        this.polytunnels = data.data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load polytunnels. Please try again.';
        console.error(err);
      },
    });
  }

  plantGetAll(): void {
    this.plantService.getAll().subscribe({
      next: (data) => {
        this.plants = data.data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load plants. Please try again.';
        console.error(err);
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reportForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onReset(): void {
    this.reportForm.reset();
    this.errorMessage = null;
  }

  onDownload(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;
    const formValue: ReportForm = this.reportForm.value;
    this.fetchReport(formValue, 'download').subscribe({
      next: (response: any) => {
        const fileName = `${formValue.reportType}_report_${this.datePipe.transform(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.pdf`;
        exportToCSV(response.data, fileName);
        this.isSubmitting = false;
        this.onReset();
      },
      error: (err) => {
        this.errorMessage = err.status === 400
          ? 'Invalid report parameters. Please check your inputs.'
          : 'Failed to download report. Please try again.';
        this.isSubmitting = false;
        console.error(err);
      },
    });
  }

  onDownloadCSV(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue: ReportForm = this.reportForm.value;

    this.fetchReport(formValue, 'csv').subscribe({
      next: (response) => {
        console.log(response)
        // const csvData = this.transformToCSVData(response.data);
        // exportToCSV(csvData, `${formValue.reportType}_report`);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.status === 400
          ? 'Invalid report parameters. Please check your inputs.'
          : 'Failed to download CSV. Please try again.';
        this.isSubmitting = false;
        console.error(err);
      },
    });
  }

  private fetchReport(formValue: ReportForm, action: 'csv' | 'download'): Observable<any> {
    const { startDate, endDate, plantId, plotId, reportType } = formValue;
    const serviceCall = (reportType: string): Observable<any> => {
      switch (reportType) {
        case 'polytunnel':
          return this.reportsService.getPolytunnelReport(startDate, endDate, plotId);
        case 'plant':
          return this.reportsService.getPlantReport(startDate, endDate, plantId);
        case 'irrigation':
          return this.reportsService.getIrrigationReport(startDate, endDate, plotId);
        case 'financial':
          return this.reportsService.getFinancialReport(startDate, endDate, plotId);
        default:
          throw new Error('Invalid report type');
      }
    };
    return serviceCall(reportType);
  }

  private transformToCSVData(data: any): any[][] {
    // Default transformation assuming data is an array of objects
    // Adjust based on actual response.data structure
    if (!Array.isArray(data)) {
      return [['Error', 'No data available']];
    }

    // Extract headers from the first object (if data exists)
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const rows = data.map((item: any) => Object.values(item));
    return [headers, ...rows];
  }
}
