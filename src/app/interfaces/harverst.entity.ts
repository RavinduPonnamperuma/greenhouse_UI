export interface Plant {
  id: number;
  plantName: string;
  status: string;
  cost: number;
  harvestTime: number;
  startDate: string; // or Date
  endTime: string;   // or Date
}

export interface HarvestDTO {
  id: number;
  harvestDate: string; // or Date
  sellingPrice: string; // could be string or number based on backend
  quantity: string;     // same as above
  variety: string;
  plant: Plant;
}
