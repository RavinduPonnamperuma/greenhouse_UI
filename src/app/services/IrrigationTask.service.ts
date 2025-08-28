import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {finalize, Observable, tap} from "rxjs";
import {APIRequest, APIRequestResources} from "../../core";
import {PlantTrayDTO} from "../interfaces/polytunnel.interface";
import {PlantDto} from "../interfaces/plant.interface";
import {PlantTaskDto} from "../interfaces/irrigation-task.entity";


@Injectable({
  providedIn: 'root',
})
export class IrrigationTaskService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.IrrigationTaskService)
  }

  create(data: any) {
    return this.post<any>(data, {
    });
  }

  getAll(){
    return this.get<PlantTaskDto[]>({
    })
  }

  update = (id: number, payload: any) => {
    const options = {suffix: id.toString()};
    return this.patch<any>(payload, options).pipe(
      tap(() => {

      })
    );
  }
  deleteTask(id: any) {
    return this.delete<any>({id}).pipe(
      tap(response => {
        console.log('Delete response:', response);
      }),
      finalize(() => {
        console.log('Delete request finalized.');
      })
    );
  }



}
