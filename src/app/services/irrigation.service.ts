import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {APIRequest, APIRequestResources} from "../../core";
import {PlantTrayDTO} from "../interfaces/polytunnel.interface";
import {PlantDto} from "../interfaces/plant.interface";
import {IrrigationDTO} from "../interfaces/irrigation.entity";


@Injectable({
  providedIn: 'root',
})
export class IrrigationService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.IrrigationService)
  }

  createPlant(data: any) {
    return this.post<any>(data, {
    });
  }

  getAll(){
    return this.get<IrrigationDTO[]>({
    })
  }

}
