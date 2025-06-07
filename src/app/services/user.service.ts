import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import {environment} from "../../environments/environment.development";




@Injectable({
    providedIn: 'root',
})
export class UserService {

    private readonly baseUrl = environment.baseUrl;
    constructor(private httpClient: HttpClient) {
      this.getUsers();
    }


    getUsers(): Observable<HttpResponse<any>> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.get<any>(`${this.baseUrl}/user`, {
            headers,
            observe: 'response',
        });
    }


    createUser(data: any): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.post(`${this.baseUrl}/user`, data, { headers });
    }
}
