export type ViewState = 'landing' | 'dashboard' | 'create-farm' | 'monitoring' | 'library' | 'community' | 'calendar';

export type SoilType = 'Loam' | 'Clay' | 'Sandy' | 'Silty' | 'Chalky' | 'Peaty';
export type Season = 'Wet Season' | 'Dry Season' | 'Year-Round' | 'Cool Season';
export type FarmStatus = 'Active' | 'Fallow' | 'Harvested' | 'Planning';

export interface Crop {
  id: string;
  name: string;
  scientificName?: string;
  suitableSoils: SoilType[];
  seasons: Season[];
  growthHabit: string;
  imageUrl: string;
  plantingMethod: {
    methods: { name: string; steps: string[]; imageUrl?: string }[];
    spacing: string;
    depth: string;
  };
  supportStructure?: {
    description?: string;
    materials?: string[];
    steps?: string[];
    imageUrl?: string;
  };
  harvestGuide?: {
    tools: string[];
    steps: string[];
    imageUrl?: string;
  };
  nutrientNeeds: {
    n: string;
    p: string;
    k: string;
    bestFertilizer: string;
    deficiencies: string[];
    remedy: string;
  };
  daysToHarvest: number;
}

export interface Disease {
  name: string;
  imageUrl?: string;
  symptoms: string[];
  prevention: string[];
  solutions: string[];
  affectedCrops: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: string;
  points: Point[];
  color?: string;
  cropId?: string;
  name?: string;
}

export interface FarmZone {
  id: string;
  polygons: Polygon[];
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
}

export interface Farm {
  id: string;
  name: string;
  plantingDate: string;
  zones: FarmZone[];
  crop: Crop;
  soil: SoilType;
  plantingMethod: string;
  supportStructure?: string;
  nutrientNeeds: { n: string; p: string; k: string };
  deficiencies?: string[];
  notes?: string;
  status: FarmStatus;
  createdAt: string;
  updatedAt: string;
}
