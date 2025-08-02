


export enum APIRequestResources {
  AuthService = 'auth',
  SensorService = 'sensor',
  UserService = 'user',
  DeviceService = 'device',
  PolytunnelService = 'polytunnel',
  PlantService = 'plant',
  ActionService = 'action',
  IrrigationService = 'irrigation',
}

export type APIRequestResource =
  APIRequestResources.AuthService |
  APIRequestResources.SensorService |
  APIRequestResources.DeviceService |
  APIRequestResources.UserService|
  APIRequestResources.PolytunnelService |
  APIRequestResources.IrrigationService |
  APIRequestResources.ActionService |
  APIRequestResources.PlantService;
