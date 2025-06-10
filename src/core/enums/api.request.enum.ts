import {DeviceService} from "../../app/services/device.service";

export enum APIRequestResources {
  AuthService = 'auth',
  SensorService = 'sensor',
  UserService = 'user',
  DeviceService = 'device',
}

export type APIRequestResource =
  APIRequestResources.AuthService |
  APIRequestResources.SensorService |
  APIRequestResources.DeviceService |
  APIRequestResources.UserService;
