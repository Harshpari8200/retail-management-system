import { api } from './api';
import type { 
  State, 
  City, 
  ServiceCity, 
  AddServiceCityRequest,
  PaginatedStates,
  PaginatedCities,
  PaginatedServiceCities
} from '../types/location';

export const locationService = {
  
  getAllStates: async (): Promise<State[]> => {
    const response = await api.request<State[]>('/location/states');
    return response;
  },

  getStates: async (
    page: number = 0,
    size: number = 20,
    search?: string
  ): Promise<PaginatedStates> => {
    const params: any = { page, size };
    if (search) params.search = search;
    
    const response = await api.request<PaginatedStates>('/location/states/page', { params });
    return response;
  },

  getCitiesByState: async (stateId: number): Promise<City[]> => {
    const response = await api.request<City[]>(`/location/cities/state/${stateId}`);
    return response;
  },

  getCities: async (
    stateId?: number,
    search?: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedCities> => {
    const params: any = { page, size };
    if (stateId) params.stateId = stateId;
    if (search) params.search = search;
    
    const response = await api.request<PaginatedCities>('/location/cities', { params });
    return response;
  },
  
  getServiceCities: async (wholesalerId: number): Promise<ServiceCity[]> => {
    const response = await api.request<ServiceCity[]>(`/location/wholesaler/${wholesalerId}/service-cities`);
    return response;
  },

  getServiceCitiesPage: async (
    wholesalerId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedServiceCities> => {
    const params: any = { page, size };
    const response = await api.request<PaginatedServiceCities>(
      `/location/wholesaler/${wholesalerId}/service-cities/page`,
      { params }
    );
    return response;
  },

  addServiceCity: async (
    wholesalerId: number,
    data: AddServiceCityRequest
  ): Promise<ServiceCity> => {
    const response = await api.request<ServiceCity>(
      `/location/wholesaler/${wholesalerId}/service-cities`,
      {
        method: 'POST',
        data,
      }
    );
    return response;
  },

  removeServiceCity: async (wholesalerId: number, cityId: number): Promise<void> => {
    await api.request(`/location/wholesaler/${wholesalerId}/service-cities/${cityId}`, {
      method: 'DELETE',
    });
  },
};