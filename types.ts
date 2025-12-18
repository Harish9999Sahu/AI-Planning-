export interface WorkItem {
  id: string;
  category_code: string;
  master_work_category: string;
  major_scheduled_category: string;
  beneficiary_type: string;
  activity_type: string;
  work_type: string;
  permissible_work: string;
  gaw_status: "GAW" | "Non-GAW";
  sub_category_id: number;
  latitude: number;
  longitude: number;
  feasibility_score: number;
  ai_reasoning: string;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'LULC' | 'Soil' | 'Slope' | 'Drainage' | 'Groundwater' | 'Geology' | 'Cadastral';
  file: File | null;
  previewUrl: string | null;
}

export interface GeoStats {
  areaHa: number;
  streamOrder: number;
  avgSlope: number;
  soilType: string;
}

export interface SimulationConfig {
  gpName: string;
  gpCentroid: { lat: number; lng: number };
}

// Simplified Permissible Work Definition from PDF
export interface PermissibleWorkDef {
  seq: number;
  master_category_code: string;
  work_type: string;
  permissible_work: string;
  gaw_status: string;
  sub_category_id: number;
  symbol_icon?: string; 
}