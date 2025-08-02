import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {APIRequest, APIRequestResources} from "../../core";
import {SensorDataDTO} from "../interfaces/sensor-data.interface";
import {DeviceDTO} from "../interfaces/device.interface";

@Injectable({
  providedIn: 'root',
})
export class ActionService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.DeviceService)
  }

  async turnOn(id: string) {
    return this.get<any>({id}).pipe(
      tap(response => {
        console.log('Turned on with response:', response);
      })
    );
  }

  async turnOff(id: string) {
    return this.get<any>({id}).pipe(
      tap(response => {
        console.log('Turned on with response:', response);
      })
    );
  }
}
