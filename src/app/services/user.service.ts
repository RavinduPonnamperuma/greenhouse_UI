import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    private readonly baseUrl = environment.baseUrl;
    constructor(private httpClient: HttpClient) {}

    /**
     * Fetches all visitors.
     */
    getVisitors(): Observable<HttpResponse<any>> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.get<any>(`${this.baseUrl}/visitor`, {
            headers,
            observe: 'response',
        });
    }

    /**
     * Fetches visitors by NIC number.
     * @param nicNo - The NIC number to filter visitors.
     */
    getVisitorsByName(nicNo: string): Observable<HttpResponse<any>> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.get<any>(`${this.baseUrl}/visitor/nicNo/${nicNo}`, {
            headers,
            observe: 'response',
        });
    }

    /**
     * Fetches all employees.
     */
    getEmployees(): Observable<HttpResponse<any>> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.get<any>(`${this.baseUrl}/employee`, {
            headers,
            observe: 'response',
        });
    }

    /**
     * Creates a visitor appointment.
     * @param data - The appointment details.
     */
    createVisitorAppointment(data: any): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.post(`${this.baseUrl}/appointment`, data, { headers });
    }
}
