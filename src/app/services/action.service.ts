import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable, tap} from 'rxjs';
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
    super(http, APIRequestResources.ActionService)
  }

   turnOn(id: string) {
    return this.get<any>({id}).pipe(
      tap(response => {
        console.log('Turned on with response:', response);
      }),
      finalize(() => {
        console.log('Turn on request finalized.');
      })
    );
  }

  turnOff(id: string) {
    const requestOptions = {
      endpoint: `off/${id}`,
    };
    return this.get<any>(requestOptions).pipe(
      tap(response => {
        console.log('Turned off with response:', response);
      }),
      finalize(() => {
        console.log('Turn off request finalized.');
      })
    );
  }

}
