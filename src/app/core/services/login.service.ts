import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LoginResponce } from "../classes/login";
@Injectable({
    providedIn: 'root', // This makes the service available throughout the app
  })
export class LoginService{
    // data = new LoginResponce;
    // constructor(private httpClient:HttpClient){}

    // loginguser(data:any):Observable<any>{
    //     return this.httpClient.post(`http://localhost:3000/auth/login`,data);
    // }
}