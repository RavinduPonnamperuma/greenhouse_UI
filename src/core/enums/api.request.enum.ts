import {IrrigationTaskService} from "../../app/services/IrrigationTask.service";
import {HarvestService} from "../../app/services/harvest.service";


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
  HarvestService = 'harvests',
}

export type APIRequestResource =
  APIRequestResources.AuthService |
  APIRequestResources.SensorService |
  APIRequestResources.DeviceService |
  APIRequestResources.UserService|
  APIRequestResources.PolytunnelService |
  APIRequestResources.IrrigationService |
  APIRequestResources.IrrigationTaskService |
  APIRequestResources.HarvestService |
  APIRequestResources.ActionService |
  APIRequestResources.PlantService;
