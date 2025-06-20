export type RootStackParamList = {
  RouteInput: {
    selectedLocation?: Location;
    fieldType?: 'start' | 'end';
  } | undefined;
  LocationSearch: {
    fieldType: 'start' | 'end';
  };
  RouteMap: {
    startLocation: Location;
    endLocation: Location;
    routes: RouteOption[];
    selectedRouteIndex: number;
  };
};

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface RouteOption {
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
    type: string;
  };
}

export interface SearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface SearchResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: SearchResult[];
}
