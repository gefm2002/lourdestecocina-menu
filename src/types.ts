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

export type InstitutionType = "educativa" | "otras";

export type Institution = {
  id: string;
  name: string;
  address: string;
  type: InstitutionType;
  isActive: boolean;
};

export type UserApprovalStatus = "pending" | "approved" | "rejected";

export type InstitutionUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institutionId: string;
  username: string;
  password: string;
  status: UserApprovalStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
};

export type ProductType =
  | "plato"
  | "postre"
  | "bebida"
  | "guarnicion"
  | "desayuno"
  | "snack"
  | "otro";

export type Product = {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  publicPrice: number;
  isActive: boolean;
  unit: string;
};

export type MenuCycle = "weekly" | "biweekly" | "monthly";

export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

export type InstitutionalMenuOption = {
  id: string;
  productId: string;
  name: string;
  description: string;
  itemType: ProductType;
  menuPrice: number;
  source: "catalog" | "inline";
};

export type InstitutionalMenuSection = {
  id: string;
  name: string;
  itemType: ProductType;
  selectionLimit: number;
  options: InstitutionalMenuOption[];
};

export type InstitutionalMenuDay = {
  weekday: Weekday;
  sections: InstitutionalMenuSection[];
};

export type InstitutionalMenu = {
  id: string;
  institutionId: string;
  name: string;
  cycle: MenuCycle;
  startDate: string;
  endDate: string;
  isActive: boolean;
  days: InstitutionalMenuDay[];
  createdAt: string;
};

export type InstitutionalOrderSelection = {
  date: string;
  weekday: Weekday;
  sectionId: string;
  sectionName: string;
  optionId: string;
  productId: string;
  name: string;
  itemType: ProductType;
  unitPrice: number;
};

export type InstitutionalOrderStatus = "draft" | "confirmed" | "sent-whatsapp";

export type InstitutionalOrder = {
  id: string;
  institutionId: string;
  userId: string;
  menuId: string;
  createdAt: string;
  total: number;
  status: InstitutionalOrderStatus;
  selections: InstitutionalOrderSelection[];
};

export type ProductionStatus = "pending" | "in-progress" | "ready" | "delivered";

export type ProductionStatusMap = Record<string, ProductionStatus>;

export type PortalSession = {
  userId: string;
};
