import { Injectable } from '@angular/core';
import {APIRequest, APIRequestResources} from "../../core";
import {HttpClient} from "@angular/common/http";
import {PlantTrayDTO} from "../interfaces/polytunnel.interface";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PolytunnelService extends APIRequest{

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.PolytunnelService)
  }

  create(data: any) {
    return this.post<any>(data, {
    });
  }

  update = (id: number, payload: any) => {
    const options = {suffix: id.toString()};
    return this.patch<any>(payload, options).pipe(
      tap(() => {

      })
    );
  }

  getAll(){
    return this.get<PlantTrayDTO[]>({
    })
  }
}
