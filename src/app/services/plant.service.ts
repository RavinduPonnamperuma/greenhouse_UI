import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {finalize, Observable, tap} from "rxjs";
import {APIRequest, APIRequestResources} from "../../core";
import {PlantTrayDTO} from "../interfaces/polytunnel.interface";
import {PlantDto} from "../interfaces/plant.interface";


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

  updatePlant = (id: number, payload: any) => {
    const options = {suffix: id.toString()};
    return this.put<any>(payload, options).pipe(
      tap(() => {

      })
    );
  }


  deletePlant(id: any) {
    return this.delete<any>({id}).pipe(
      tap(response => {
        console.log('Delete response:', response);
      }),
      finalize(() => {
        console.log('Delete request finalized.');
      })
    );
  }

  getAll(){
    return this.get<PlantDto[]>({
    })
  }


}
