import {IrrigationTaskService} from "../../app/services/IrrigationTask.service";


export enum APIRequestResources {
  AuthService = 'auth',
  SensorService = 'sensor',
  UserService = 'user',
  DeviceService = 'device',
  PolytunnelService = 'polytunnel',
  PlantService = 'plant',
  ActionService = 'action',
  IrrigationService = 'irrigation',
  IrrigationTaskService = 'schedule',
}

export type APIRequestResource =
  APIRequestResources.AuthService |
  APIRequestResources.SensorService |
  APIRequestResources.DeviceService |
  APIRequestResources.UserService|
  APIRequestResources.PolytunnelService |
  APIRequestResources.IrrigationService |
  APIRequestResources.IrrigationTaskService |
  APIRequestResources.ActionService |
  APIRequestResources.PlantService;
