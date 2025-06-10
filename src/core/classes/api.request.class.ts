import { HttpClient } from '@angular/common/http';
import { APIRequestOptions, APIResponse } from '../interfaces';
import { ApiConfig } from '../config';
import { APIRequestResources } from "../enums";

export abstract class APIRequest {
  protected constructor(
    protected http: HttpClient,
    protected resource: APIRequestResources
  ) {}

  public get<T>(options: APIRequestOptions) {
    return this.http.get<APIResponse<T>>(this.generateUrl(options), {
      params: options.params,
      headers: options.headers || {},
    });
  }

  public getBlob(options: APIRequestOptions, jsperKey: string) {
    const headers = { jspAuthKey: jsperKey, ...options.headers };
    return this.http.get(this.generateUrl(options), {
      headers,
      responseType: 'blob',
    });
  }

  public delete<T>(options: APIRequestOptions) {
    return this.http.delete<APIResponse<T>>(this.generateUrl(options), {
      body: options.params,
      headers: options.headers,
    });
  }

  public post<T>(data: unknown, options: APIRequestOptions) {
    return this.sendWithBody<T>('POST', data, options);
  }

  public put<T>(data: unknown, options: APIRequestOptions) {
    return this.sendWithBody<T>('PUT', data, options);
  }

  public patch<T>(data: unknown, options: APIRequestOptions) {
    return this.sendWithBody<T>('PATCH', data, options);
  }

  private sendWithBody<T>(
    method: 'POST' | 'PUT' | 'PATCH',
    data: unknown,
    options: APIRequestOptions
  ) {
    const url = this.generateUrl(options);
    const config = {
      params: options.params,
      headers: options.headers,
    };

    switch (method) {
      case 'POST':
        return this.http.post<APIResponse<T>>(url, data, config);
      case 'PUT':
        return this.http.put<APIResponse<T>>(url, data, config);
      case 'PATCH':
        return this.http.patch<APIResponse<T>>(url, data, config);
    }
  }

  private generateUrl({
                        id,
                        resource,
                        endpoint,
                        suffix,
                      }: APIRequestOptions): string {
    const parts = [
      ApiConfig.baseURL,
      resource ?? this.resource,
      id,
      endpoint,
      suffix,
    ].filter(Boolean);
    return parts
      .join('/')
      .replace(/([^:]\/)\/+/g, '$1'); // Keeps "://" intact for protocol
  }
}
