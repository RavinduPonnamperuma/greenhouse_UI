import {APIRequestResource} from "../enums";


export interface APIRequestOptions {
  id?: string;
  resource?: APIRequestResource;
  endpoint?: string;
  suffix?: string;
  params?: Record<string, string | string[] | number | boolean>;
  headers?: Record<string, string>;
}

export interface APIResponse<T> {
  data: T;
}

export interface PaginationResponse<T> {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  data: T;
}

export interface CachedAPIMap {
  timestamp: Date;
  value: APIResponse<unknown>;
}
