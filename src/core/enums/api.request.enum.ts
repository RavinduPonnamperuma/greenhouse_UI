import {DeviceService} from "../../app/services/device.service";


export enum APIRequestResources {
  AuthService = 'auth',
  SensorService = 'sensor',
  UserService = 'user',
  DeviceService = 'device',
  PolytunnelService = 'polytunnel',
  PlantService = 'plant',
}

export type APIRequestResource =
  APIRequestResources.AuthService |
  APIRequestResources.SensorService |
  APIRequestResources.DeviceService |
  APIRequestResources.UserService|
  APIRequestResources.PolytunnelService|
  APIRequestResources.PlantService;
