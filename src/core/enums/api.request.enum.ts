export enum APIRequestResources {
  AuthService = 'auth',
  SensorService = 'sensor',
}

export type APIRequestResource =
  APIRequestResources.AuthService|APIRequestResources.SensorService;
