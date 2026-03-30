export interface State {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  name: string;
  stateId: number;
  stateName: string;
}

export interface ServiceCity {
  id: number;
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
}


export interface PaginatedStates {
  content: State[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface PaginatedCities {
  content: City[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface PaginatedServiceCities {
  content: ServiceCity[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface ServiceCity {
  id: number;
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
}

export interface AddServiceCityRequest {
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
}
