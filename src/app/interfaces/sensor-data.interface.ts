export interface SensorDataDTO {
  id: number;
  topic: string;
  value: number;
  createdAt: string;
}


export interface TemperatureDTO extends SensorDataDTO {}
export interface HumidityDTO extends SensorDataDTO {}
export interface MoistureDTO extends SensorDataDTO {}

export interface WaterTankLevelDto {
  waterTankId: number;
  tankNumber: string;
  totalCapacity: number;
  totalOut: string; // since it's coming as "0.00"
  currentWaterLevel: string; // since it's coming as "1550.00"
}

export interface DashboardMetricsDto {
  growingPlants: number;
  harvestedPlants: number;
  totalIncome: number;
}
