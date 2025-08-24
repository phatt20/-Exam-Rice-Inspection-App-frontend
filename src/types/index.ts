export interface Standard {
  id: string;
  name: string;
  standardData: SubStandard[];
}

export interface SubStandard {
  key: string;
  name: string;
  maxLength: number;
  minLength: number;
  conditionMax: string;
  conditionMin: string;
  shape: string[];
}

export interface InspectionHistory {
  id: string;
  name: string;
  standard?: { name: string };
  note?: string;
  price?: number | string;
  samplingPoint?: string[];
  imageURL?: string;
  dateTime?: string;
  createdAt: string;
  updatedAt: string;

  inspectionResult?: {
    composition: CompositionRow[];
    defectRice: DefectRow[];
    totalSample?: number;
  };
}

export interface CompositionRow {
  name: string;
  length: string;
  actual: string;
}

export interface DefectRow {
  name: string;
  actual: string;
}
