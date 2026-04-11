export type PropertyType    = "house" | "apartment" | "shop" | "office" | "land";
export type ListingPurpose  = "rent" | "sale";
export type UserRole        = "user" | "agent" | "admin";
export type RequestUrgency  = "normal" | "urgent";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRole;
  is_verified: boolean;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  price_period?: "monthly" | "yearly" | "total";
  type: PropertyType;
  purpose: ListingPurpose;
  location: string;
  area: OsogboArea;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  images: string[];
  amenities?: string[];
  agent_id: string;
  agent?: User;
  is_featured: boolean;
  is_available: boolean;
  slug: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyRequest {
  id: string;
  type: PropertyType;
  purpose: ListingPurpose;
  area: OsogboArea | "Anywhere in Osogbo";
  budget_min?: number;
  budget_max?: number;
  bedrooms?: string;
  timeline?: string;
  description?: string;
  whatsapp: string;
  name?: string;
  urgency: RequestUrgency;
  is_fulfilled: boolean;
  created_at: string;
}

export type OsogboArea =
  | "Ogo-Oluwa" | "Dada Estate" | "Oke-Fia" | "Igbona"
  | "Alekuwodo" | "Stadium Road" | "Gbongan Road" | "Ilesha Road"
  | "Sabo" | "Lameco" | "Powerline" | "Old Garage" | "Isale Aro"
  | "Owode" | "Ataoja" | "Burna" | "Ilobu Road" | "Okeku"
  | "Osun State University Area" | "Other";

export const OSOGBO_AREAS: OsogboArea[] = [
  "Ogo-Oluwa","Dada Estate","Oke-Fia","Igbona","Alekuwodo",
  "Stadium Road","Gbongan Road","Ilesha Road","Sabo","Lameco",
  "Powerline","Old Garage","Isale Aro","Owode","Ataoja",
  "Burna","Ilobu Road","Okeku","Osun State University Area","Other",
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "house",     label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "shop",      label: "Shop" },
  { value: "office",    label: "Office" },
  { value: "land",      label: "Land" },
];

export interface PropertyFilters {
  type?: PropertyType;
  purpose?: ListingPurpose;
  area?: OsogboArea;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
