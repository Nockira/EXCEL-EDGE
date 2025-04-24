export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  pricing?: string;
  items?: { name: string }[];
  tiers?: PricingTier[];
}

export interface PricingTier {
  range?: string;
  price?: string;
  name?: string;
}

export interface Service {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: string;
  basePrice: number;
  category: string;
  isMonthly: boolean;
}
