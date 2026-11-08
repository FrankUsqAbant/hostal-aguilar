export type RoomType = 'simple' | 'doble' | 'matrimonial' | 'romantica';

export interface Room {
  id: string;
  type: RoomType;
  badge: string;
  name: string;
  subtitle: string;
  description: string;
  pricePerNight: number;
  capacity: string;
  bedType: string;
  image: string;
  gallery: string[];
  amenities: string[];
  ctaColor: 'blue' | 'red';
  featured?: boolean;
}

export interface Amenity {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  avatarText: string;
  rating: number;
  comment: string;
  date: string;
  source: string;
}

export interface Landmark {
  id: string;
  title: string;
  description: string;
  iconType: 'bus' | 'map' | 'church';
  distance: string;
  travelTip?: string;
  meters?: number;
}

export interface BookingState {
  checkInDate: string;
  checkOutDate: string;
  roomType: RoomType;
  guests: number;
  specialRequests?: string;
}
