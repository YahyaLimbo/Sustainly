import type { Item, RentRequest, InventoryStats } from '../types';

export const api = {
  async getItems(category?: string, location?: string, page: number = 0, size: number = 10): Promise<{ content: Item[], totalPages: number }> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    const response = await fetch('/items?' + params.toString());
    return response.json();
  },
  async getItemById(id: string, userLat?: number, userLon?: number): Promise<Item> {
    const params = new URLSearchParams();
    if (userLat) params.append('userLat', userLat.toString());
    if (userLon) params.append('userLon', userLon.toString());
    const response = await fetch('/items/' + id + '?' + params.toString());
    return response.json();
  },
  async createRentRequest(request: RentRequest): Promise<RentRequest> {
    const response = await fetch('/rent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return response.json();
  },
  async getUserRequests(renterId: string): Promise<RentRequest[]> {
    const response = await fetch('/rent/user/' + renterId);
    return response.json();
  },
  async getInventoryStats(): Promise<InventoryStats> {
    const response = await fetch('/items/check');
    return response.json();
  }
};
