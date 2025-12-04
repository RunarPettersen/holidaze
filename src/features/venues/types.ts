export type VenueMedia = {
  url: string;
  alt?: string;
};

export type VenueMeta = {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
};

export type VenueLocation = {
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  continent?: string;
  lat?: number;
  lng?: number;
};

export type VenueOwnerAvatar = {
  url: string;
  alt?: string;
};

export type VenueOwner = {
  name: string;
  email?: string;
  avatar?: VenueOwnerAvatar;
};

export type Venue = {
  id: string;
  name: string;
  description?: string;
  media?: VenueMedia[];
  price: number;
  rating?: number;
  maxGuests: number;
  meta?: VenueMeta;
  location?: VenueLocation;
  owner?: VenueOwner;   // ← viktig
  created?: string;
  updated?: string;
};