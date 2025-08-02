export interface Plant {
  id: number;
  plantName: string;
  status: string;
  cost: number;
  harvestTime: number;
  startDate: string; // ISO Date
  endTime: string;   // ISO Date
}

export interface Irrigation {
  id: number;
  waterPerDay: string;       // e.g., "10.00"
  fertilizerPerDay: string;  // e.g., "10.55"
  timesPerDay: number;
  isMorning: boolean;
  morningTime: string;       // e.g., "10:00"
  isEvening: boolean;
  eveningTime: string;       // e.g., "17:00"
  duration: number;
}

export interface PlantTaskDto {
  id: number;
  scheduledDate: string;     // ISO Date
  scheduledTime: string;     // e.g., "06:30"
  taskType: 'watering' | 'fertilizing' | string; // extend as needed
  duration: number;
  isCompleted: boolean;
  plant: Plant;
  irrigation: Irrigation;
}
