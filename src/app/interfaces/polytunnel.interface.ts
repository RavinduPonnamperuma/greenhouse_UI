export interface PlantTrayDTO {
  id: number;
  code: string;
  status: string;
  location: string;
  size: string | number; // 'Large' in one, '150' in another
  length: number;
  width: number;
  numberOfPlants: string; // could also consider `number` if the data is numeric
}
