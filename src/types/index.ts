export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface TripInput {
  departure: Location | null;
  destination: Location | null;
  departureTime: string;
  duration: number; // in days
}

export interface Preferences {
  interests: string[];
  foodPreferences: string[];
  budget: 'low' | 'medium' | 'high';
  pace: 'relaxed' | 'moderate' | 'packed';
}

export interface Transportation {
  type: 'bus' | 'train' | 'flight' | 'walk' | 'subway';
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  company: string;
  route?: {
    lat: number;
    lng: number;
  }[];
}

export interface Activity {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'activity';
  description: string;
  location: Location;
  duration: string;
  price: number;
  rating: number;
  imageUrl?: string;
  tags: string[];
}

export interface DayItinerary {
  day: number;
  date: string;
  transportation: Transportation[];
  activities: Activity[];
  totalDistance: number;
  totalCost: number;
}

export interface TravelPlan {
  overview: {
    totalDays: number;
    totalCost: number;
    totalDistance: number;
  };
  itinerary: DayItinerary[];
}
