import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { PlantService } from '../../services/plant.service';
import { PolytunnelService } from '../../services/polytunnel.service';
import { ReportsService } from '../../services/reports.service';
import { PlantTrayDTO } from '../../interfaces/polytunnel.interface';
import { PlantDto } from '../../interfaces/plant.interface';
import { saveAs } from 'file-saver';
import { Observable, map } from 'rxjs';

interface ReportForm {
  startDate: string;
  endDate: string;
  plantId: string;
  plotId: string;
  reportType: string;
}

// Define interfaces for report data (adjust based on actual API response structure)
interface ReportData {
  // Example structure, replace with actual report data structure
  id: string;
  name: string;
  data: any;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf, NgClass, JsonPipe],
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
  previewData: ReportData | null = null;

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
    this.previewData = null;
    this.errorMessage = null;
  }

  onPreview(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.previewData = null;

    const formValue: ReportForm = this.reportForm.value;

    this.fetchReport(formValue, 'preview').subscribe({
      next: (data) => {
        this.previewData = data;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.status === 400
          ? 'Invalid report parameters. Please check your inputs.'
          : 'Failed to load preview. Please try again.';
        this.isSubmitting = false;
        console.error(err);
      },
    });
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
      next: (response: Blob) => {
        const fileName = `${formValue.reportType}_report_${this.datePipe.transform(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.pdf`;
        saveAs(response, fileName);
        this.isSubmitting = false;
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

  private fetchReport(formValue: ReportForm, action: 'preview' | 'download'): Observable<any> {
    const { startDate, endDate, plantId, plotId, reportType } = formValue;

    // Map reportType to the appropriate service method
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
}
