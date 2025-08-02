export interface PolytunnelDto {
  id: number;
  code: string;
  status: string; // you can use: 'active' | 'inactive' if statuses are known
  location: string;
  size: string;
  length: number;
  width: number;
  numberOfPlants: string; // if this is always a string, keep it, otherwise use `number`
}

export interface PlantDto {
  id: number;
  plantName: string;
  status: string; // you can use: 'growing' | 'harvested' | etc if statuses are known
  cost: number;
  harvestTime: number; // assuming days
  startDate: string; // ISO date string, or you can use `Date` type if you parse it
  endTime: string; // same as startDate
  polytunnel: PolytunnelDto;
}
