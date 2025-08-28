import {Injectable} from "@angular/core";
import {APIRequest, APIRequestResources} from "../../core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SensorDataDTO} from "../interfaces/sensor-data.interface";

@Injectable({
  providedIn: 'root',
})
export class ReportsService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.ReportsService)
  }

  reportGet(startDate: string, endDate: string, polytunnel: string): Observable<any> {
    return this.get<any>({
      endpoint: 'financial',
      params: {
        startDate: startDate,
        endDate: endDate,
        polytunnel: polytunnel,
      },
    });
  }

  getPolytunnelReport(startDate: string, endDate: string, polytunnel: string): Observable<any> {
    return this.get<any>({
      endpoint: 'polytunnel',
      params: {
        startDate: startDate,
        endDate: endDate,
        polytunnel: polytunnel,
      },
    });
  }

  getPlantReport(startDate: string, endDate: string, plant: string): Observable<any> {
    return this.get<any>({
      endpoint: 'plant',
      params: {
        startDate: startDate,
        endDate: endDate,
        plant: plant,
      },
    });
  }
  getIrrigationReport(startDate: string, endDate: string, polytunnel: string): Observable<any> {
    return this.get<any>({
      endpoint: 'irrigation',
      params: {
        startDate: startDate,
        endDate: endDate,
        polytunnel: polytunnel,
      },
    });
  }

  getFinancialReport(startDate: string, endDate: string, polytunnel: string): Observable<any> {
    return this.get<any>({
      endpoint: 'financial',
      params: {
        startDate: startDate,
        endDate: endDate,
        polytunnel: polytunnel,
      },
    });
  }
}
