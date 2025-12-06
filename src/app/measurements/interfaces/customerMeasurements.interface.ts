export interface BlouseTopMeasurements {
  blouseLength?: number;
  kurtaLength?: number;
  upperChest?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  sleeveLength?: number;
  mori?: number;
  byshape?: number;
  armhole?: number;
  frontNeckDepth?: number;
  backNeckDepth?: number;
  dartPoint?: number;
}

export interface LehengaPantMeasurements {
  length?: number;
  waist?: number;
  hip?: number;
  thigh?: number;
  knee?: number;
  ankle?: number;
  crotch?: number;
  mori?: number;
}

export interface CustomerMeasurement {
  customerId: number; // 1:1 relation
  blouseTop?: BlouseTopMeasurements;
  lehengaPant?: LehengaPantMeasurements;
}
