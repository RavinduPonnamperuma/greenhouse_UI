import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {APIRequest, APIRequestResources} from "../../core";
import {SensorDataDTO, WaterTankLevelDto} from "../interfaces/sensor-data.interface";

@Injectable({
  providedIn: 'root',
})
export class SensorDataService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.SensorService)
  }

  public getSensorById(topics: string): Observable<any> {
    return this.get<SensorDataDTO>({
      params: {
        topic: topics,
      },
    });
  }

  public getWaterTank(id: number): Observable<any> {
    const requestOptions = {
      endpoint: `water-level/${id}`,
    };
    return this.get<WaterTankLevelDto>(requestOptions).pipe(
      tap(response => {
      }),
      finalize(() => {

      })
    );
  }

}
