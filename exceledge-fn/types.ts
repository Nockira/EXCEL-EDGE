export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  pricing?: string;
  items?: { name: string }[]; // For nested items in negotiable services
  tiers?: PricingTier[]; // For tiered pricing
}

export interface PricingTier {
  range?: string; // Make optional since negotiable services don't use range/price
  price?: string;
  name?: string; // Add for negotiable service items
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: ServiceItem[];
}
