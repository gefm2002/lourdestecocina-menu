import type {
  InstitutionalMenu,
  InstitutionalOrder,
  InstitutionType,
  MenuCycle,
  ProductType,
  ProductionStatus,
  Weekday,
} from "../types";

export const WEEKDAYS: Array<{ value: Weekday; label: string }> = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
];

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  plato: "Plato",
  postre: "Postre",
  bebida: "Bebida",
  guarnicion: "Guarnición",
  desayuno: "Desayuno",
  snack: "Snack",
  otro: "Otro",
};

export const MENU_CYCLE_LABELS: Record<MenuCycle, string> = {
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
};

export const USER_STATUS_LABELS = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
} as const;

/** Texto amigable para el portal público (escuelas, empresas, personas en grupo). */
export const INSTITUTION_TYPE_PUBLIC_LABELS: Record<InstitutionType, string> = {
  educativa: "Educación",
  otras: "Empresa u otro grupo",
};

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  pending: "Pendiente",
  "in-progress": "En producción",
  ready: "Listo",
  delivered: "Despachado",
};

export const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const parseDate = (value: string) => new Date(`${value}T12:00:00`);

export const toISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const startOfWeek = (date: Date) => {
  const next = new Date(date);
  const currentDay = next.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  next.setDate(next.getDate() + diff);
  next.setHours(12, 0, 0, 0);
  return next;
};

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit" }).format(parseDate(value));

export const formatLongDate = (value: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parseDate(value));

export const getWeekdayForDate = (value: string): Weekday | null => {
  const day = parseDate(value).getDay();
  const map: Record<number, Weekday | null> = {
    0: null,
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: null,
  };
  return map[day];
};

export const getWeekdayLabel = (weekday: Weekday) =>
  WEEKDAYS.find((item) => item.value === weekday)?.label ?? weekday;

export const getBusinessDatesBetween = (startDate: string, endDate: string) => {
  const dates: string[] = [];
  const cursor = parseDate(startDate);
  const end = parseDate(endDate);

  while (cursor <= end) {
    const iso = toISODate(cursor);
    const weekday = getWeekdayForDate(iso);
    if (weekday) {
      dates.push(iso);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

export const getMenuCalendar = (menu: InstitutionalMenu) => {
  const dayLookup = new Map(menu.days.map((day) => [day.weekday, day]));
  return getBusinessDatesBetween(menu.startDate, menu.endDate)
    .map((date) => {
      const weekday = getWeekdayForDate(date);
      if (!weekday) return null;
      const template = dayLookup.get(weekday);
      if (!template) return null;
      return {
        date,
        weekday,
        label: getWeekdayLabel(weekday),
        sections: template.sections,
      };
    })
    .filter(Boolean) as Array<{
    date: string;
    weekday: Weekday;
    label: string;
    sections: InstitutionalMenu["days"][number]["sections"];
  }>;
};

export const isDateWithinRange = (value: string, startDate: string, endDate: string) =>
  value >= startDate && value <= endDate;

export const getTodayISO = () => toISODate(new Date());

export const getActiveMenus = (menus: InstitutionalMenu[], institutionId?: string) => {
  const today = getTodayISO();
  return menus
    .filter((menu) => menu.isActive)
    .filter((menu) => (institutionId ? menu.institutionId === institutionId : true))
    .filter((menu) => isDateWithinRange(today, menu.startDate, menu.endDate))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
};

export const getUpcomingMenus = (menus: InstitutionalMenu[], institutionId?: string) => {
  const today = getTodayISO();
  return menus
    .filter((menu) => menu.isActive)
    .filter((menu) => (institutionId ? menu.institutionId === institutionId : true))
    .filter((menu) => menu.startDate > today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
};

export const sumOrderSelections = (order: InstitutionalOrder) =>
  order.selections.reduce((acc, selection) => acc + selection.unitPrice, 0);

export const buildProductionKey = (date: string, productId: string) => `${date}::${productId}`;
