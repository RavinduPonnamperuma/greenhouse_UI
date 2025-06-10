import { Injectable } from '@angular/core';
import {APIRequest, APIRequestResources} from "../../core";
import {HttpClient} from "@angular/common/http";

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
}
