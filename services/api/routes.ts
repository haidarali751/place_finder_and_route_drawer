import { RouteOption, Location, SearchResponse } from '@/types/navigation';

export const fetchRoutes = async (
  start: Location,
  end: Location
): Promise<RouteOption[]> => {
  const url = `http://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&alternatives=true`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('No routes found');
  }

  return data.routes.map((route: any) => ({
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry,
  }));
};

export const fetchLocations = async (query: string): Promise<Location[]> => {
  if (query.length < 2) return [];

  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodedQuery}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

  const response = await fetch(url);
  const data: SearchResponse = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  const locations: Location[] = data.results.map((result, index) => ({
    id: `${index}`,
    name: result.SEARCHVAL || result.BUILDING || result.ROAD_NAME || 'Unknown Location',
    address: result.ADDRESS || 'Address not available',
    latitude: parseFloat(result.LATITUDE),
    longitude: parseFloat(result.LONGITUDE),
  }));

  return locations;
};
