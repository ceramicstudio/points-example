export interface Guilds {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}

export interface AggregationContent {
  recipient: string; // DID
  points: number;
  date: string;
}

export interface PointsContent {
  recipient: string;
  points: number;
  date: string;
}

export interface AllocationContent {
  recipient: string;
  points: number;
  context: string;
  multiplier?: number;
  date: string;
}

export interface AllocationNode {
  points: number;
  id: string;
  context: string;
  issuer: {
    id: string;
  };
  recipient: {
    id: string;
  };
  multiplier?: number;
}
