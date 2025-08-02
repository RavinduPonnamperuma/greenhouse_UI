import {DeviceService} from "../../app/services/device.service";
import {ActionService} from "../../app/services/action.service";


export enum APIRequestResources {
  AuthService = 'auth',
  SensorService = 'sensor',
  UserService = 'user',
  DeviceService = 'device',
  PolytunnelService = 'polytunnel',
  PlantService = 'plant',
  ActionService = 'action',
}

export type APIRequestResource =
  APIRequestResources.AuthService |
  APIRequestResources.SensorService |
  APIRequestResources.DeviceService |
  APIRequestResources.UserService|
  APIRequestResources.PolytunnelService |
  APIRequestResources.ActionService |
  APIRequestResources.PlantService;
