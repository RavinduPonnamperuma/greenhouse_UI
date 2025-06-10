import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";

interface Report {
  startDate: string;
  endDate: string;
  plantId: string;
  plotId: string;
  reportType: string;
  generatedAt: string;
}


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    TitleCasePipe
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  providers: [DatePipe],
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  plants = [
    { id: '1', name: 'Tomato' },
    { id: '2', name: 'Cucumber' },
    { id: '3', name: 'Lettuce' },
  ];
  plots = [
    { id: '1', code: 'PT-001' },
    { id: '2', code: 'PT-002' },
    { id: '3', code: 'PT-003' },
  ];
  tableData: Report[] = [
    {
      startDate: '2025-01-01',
      endDate: '2025-06-10',
      plantId: '1',
      plotId: '',
      reportType: 'plant',
      generatedAt: '2025-06-10T11:00:00',
    },
    {
      startDate: '2025-03-01',
      endDate: '2025-05-31',
      plantId: '',
      plotId: '2',
      reportType: 'polytunnel',
      generatedAt: '2025-06-09T14:30:00',
    },
    {
      startDate: '2025-01-01',
      endDate: '2025-06-10',
      plantId: '',
      plotId: '',
      reportType: 'financial',
      generatedAt: '2025-06-08T09:15:00',
    },
  ];

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.reportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      plantId: [''],
      plotId: [''],
      reportType: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.reportForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reportForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getPlantName(plantId: string): string {
    if (!plantId) return 'All Plants';
    const plant = this.plants.find(p => p.id === plantId);
    return plant ? plant.name : 'Unknown';
  }

  getPlotCode(plotId: string): string {
    if (!plotId) return 'All Polytunnels';
    const plot = this.plots.find(p => p.id === plotId);
    return plot ? plot.code : 'Unknown';
  }

  onDownload(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue: Report = {
      ...this.reportForm.value,
      generatedAt: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') || '',
    };
    console.log('Report parameters:', formValue);

    // Simulate report generation
    setTimeout(() => {
      this.tableData.push(formValue);
      this.isSubmitting = false;
      this.reportForm.reset();
      // TODO: Implement actual report download (e.g., trigger file download)
    }, 1000);
  }
}
