import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {APIRequest, APIRequestResources} from "../../core";
import {SensorDataDTO} from "../interfaces/sensor-data.interface";

@Injectable({
  providedIn: 'root',
})
export class DeviceService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.DeviceService)
  }

  public getSensorById(topics: string): Observable<any> {
    return this.get<SensorDataDTO>({
      params: {
        topic: topics,
      },
    });
  }

}
