import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {APIRequest, APIRequestResources} from "../../core";


@Injectable({
  providedIn: 'root',
})
export class PlantService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.PlantService)
  }

  createPlant(data: any) {
    return this.post<any>(data, {
    });
  }


}
