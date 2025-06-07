import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  private readonly apiUrl = `${environment.baseUrl}/sensors`;  // API URL

  constructor(private http: HttpClient) {}

  // Fetch all sensor data with error handling
  getAllSensorData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching sensor data:', error);  // Log error
        throw error;  // Re-throw error or handle it appropriately
      })
    );
  }

  // Fetch all sensor data in descending order
  getAllSensorDataDescending(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-descending`).pipe(
      catchError(error => {
        console.error('Error fetching descending sensor data:', error);
        throw error;
      })
    );
  }

  getLastSensorData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/last`);  // Call the 'last' endpoint
  }


}
