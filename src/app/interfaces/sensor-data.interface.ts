export interface SensorDataDTO {
  id: number;
  topic: string;
  value: number;
  createdAt: string;
}


export interface TemperatureDTO extends SensorDataDTO {}
export interface HumidityDTO extends SensorDataDTO {}
export interface MoistureDTO extends SensorDataDTO {}
