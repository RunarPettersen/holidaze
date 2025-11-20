export type Booking = {
  id: string;
  dateFrom: string; // ISO
  dateTo: string;   // ISO
  guests: number;
  venue?: {
    id: string;
    name: string;
    media?: { url: string; alt?: string }[];
    location?: { city?: string; country?: string };
    price?: number;
  };
};