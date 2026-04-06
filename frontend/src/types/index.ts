export interface Item {
  id: string;
  item_id: string;
  owner_id: string;
  name: string;
  category: string;
  location: string;
  daily_rate: number; // Matched to @JsonProperty
  available: boolean;
  condition: string;
  description: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

export interface RentRequest {
  rent_id?: string;
  renter_id: string;
  item_id: string;
  owner_id: string;
  status?: string;
}

export interface InventoryStats {
  'Total items:': number;
  'Available items :': number;
  'Item rented: ': number;
}
