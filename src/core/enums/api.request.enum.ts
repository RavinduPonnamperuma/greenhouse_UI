export enum APIRequestResources {
  AuthService = 'auth',
  SensorService = 'sensor',
  UserService = 'user',
}

export type APIRequestResource =
  APIRequestResources.AuthService |
  APIRequestResources.SensorService |
  APIRequestResources.UserService;
