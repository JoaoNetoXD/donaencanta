export interface Kit {
  id: string;
  label: string;
  sub?: string;
  qty: number;
  price: number;
  badge?: string;
  /** Link de checkout DESTE kit (ex: "/c/cortador-2un"). Vazio = usa o do produto. */
  checkoutUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  bullets: string[];
  images: string[];
  kits: Kit[];
  /** URL de checkout externo (ex: Shark Bot). Se definido, abre em iframe dentro do modal. */
  checkoutUrl?: string;
}

export interface Review {
  id: string;
  userName: string;
  city: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
  verified: boolean;
}
