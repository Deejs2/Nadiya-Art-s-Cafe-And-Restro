export type Lang = 'en' | 'ne';

export interface LocalizedText {
  en: string;
  ne: string;
}

export interface MenuVariant {
  label: LocalizedText;
  price: number;
  veg: boolean;
  quantity?: LocalizedText;
}

export interface MenuItem {
  id: number;
  title: LocalizedText;
  price: number | null;
  badge: 'bestseller' | 'popular' | 'new' | null;
  spicy: boolean;
  veg: boolean | null;
  variants: MenuVariant[] | null;
  quantity?: LocalizedText;
}

export interface MenuCategory {
  id: string;
  name: LocalizedText;
  icon: string;
  items: MenuItem[];
}

export interface RestaurantInfo {
  name: LocalizedText;
  tagline: LocalizedText;
  phone: string;
  email: string;
  address: LocalizedText;
  hours: { en: string[]; ne: string[] };
}

export interface MenuData {
  categories: MenuCategory[];
  currency: string;
  restaurant: RestaurantInfo;
}
