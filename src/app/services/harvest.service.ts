import {Injectable} from "@angular/core";
import {APIRequest, APIRequestResources} from "../../core";
import {HttpClient} from "@angular/common/http";
import {IrrigationDTO} from "../interfaces/irrigation.entity";
import {HarvestDTO} from "../interfaces/harverst.entity";

@Injectable({
  providedIn: 'root',
})
export class HarvestService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.HarvestService)
  }

  create(data: any) {
    return this.post<any>(data, {
    });
  }

  getAll(){
    return this.get<HarvestDTO>({
    })
  }

}
