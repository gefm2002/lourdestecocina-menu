export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  isActive: boolean;
  order: number;
  tags: string[];
  image?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  items: MenuItem[];
};

export type MenuData = {
  categories: MenuCategory[];
};

export type SiteData = {
  brand: {
    name: string;
    tagline: string;
    igHandle: string;
  };
  contact: {
    whatsapp: string;
    whatsappDisplay: string;
    phoneDisplay: string;
    address: string;
    mapQuery: string;
  };
  hours: Array<{ days: string; time: string }>;
};

export type CartItem = {
  id: string;
  name: string;
  variant?: string;
  price: number;
  qty: number;
  image?: string;
  notes?: string;
};
