import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {PlantService} from "../../services/plant.service";
import {PolytunnelService} from "../../services/polytunnel.service";
import {PlantTrayDTO} from "../../interfaces/polytunnel.interface";
import {PlantDto} from "../../interfaces/plant.interface";

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
    NgClass
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  providers: [DatePipe],
})
export class ReportComponent implements OnInit {

  plantService = inject(PlantService)
  polytunnelService=inject(PolytunnelService)


  polytunnel:PlantTrayDTO[]=[]
  plantDtos:PlantDto[]=[]
  reportForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;


  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.tunnelGetAll();
    this.plantGetAll();
    this.reportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      plantId: [''],
      plotId: [''],
      reportType: ['', Validators.required],
    });
  }


  tunnelGetAll(){
    this.polytunnelService.getAll().subscribe({
      next: data => {
        this.polytunnel=data.data
      }
    })
  }


  plantGetAll(){
    this.plantService.getAll().subscribe({
      next: data => {
        this.plantDtos=data.data
      }
    })
  }





  ngOnInit(): void {}

  get f() {
    return this.reportForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reportForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
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

  }
}
