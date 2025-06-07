import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import {APIRequest, APIRequestResources} from "../../core";





@Injectable({
    providedIn: 'root',
})
export class UserService extends APIRequest {

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.UserService)
  }

  login(username: string, password: string) {
    const data = {
      username,
      password
    };
    return this.post<any>(data, {
      endpoint: 'login'
    });
  }




  // getUsers(): Observable<HttpResponse<any>> {
    //     const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //     return this.httpClient.get<any>(`${this.baseUrl}/user`, {
    //         headers,
    //         observe: 'response',
    //     });
    // }
    //
    //
    // createUser(data: any): Observable<any> {
    //     const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //     return this.httpClient.post(`${this.baseUrl}/user`, data, { headers });
    // }
}
