export type EquipmentStatus = 'operational' | 'maintenance' | 'critical' | 'offline';

export type DocType = 'manual' | 'datasheet' | 'schematic' | 'catalog' | 'firmware';

export interface TechnicalDoc {
  id: string;
  title: string;
  type: DocType;
  fileSize: string;
  url: string;
  contentMock?: string; // Rich text mock data to display in our interactive viewer
}

export interface MaintenanceLog {
  id: string;
  date: string;
  type: 'preventive' | 'corrective' | 'calibration' | 'inspection';
  technician: string;
  description: string;
  outcome: string;
  duration: string;
}

export interface EquipmentImages {
  general: string;
  interior?: string;
  circuitBoard?: string;
  connectors?: string;
  terminals?: string;
  label?: string;
}

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  series: string;
  categoryId: string;
  description: string;
  applications: string[];
  features: string[];
  specs: Record<string, string>;
  protocols: string[];
  inputs: string[];
  outputs: string[];
  compatibility: string[];
  location: string;
  status: EquipmentStatus;
  images: EquipmentImages;
  documents: TechnicalDoc[];
  logs: MaintenanceLog[];
  tags: string[];
  relatedEquipmentIds?: string[];
  relatedSpares?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide-react icon name
  count?: number;
}

export interface Manufacturer {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
}
