export interface Plant {
  id: number;
  plantName: string;
  status: string;
  cost: number;
  harvestTime: number;
  startDate: string; // ISO date string
  endTime: string;   // ISO date string
}

export interface IrrigationDTO {
  id: number;
  waterPerDay: string;        // e.g., "10.00"
  fertilizerPerDay: string;   // e.g., "10.55"
  timesPerDay: number;
  isMorning: boolean;
  morningTime: string;        // e.g., "10:00"
  isEvening: boolean;
  eveningTime: string;        // e.g., "17:00"
  duration: number;
  plant: Plant | null;
}
