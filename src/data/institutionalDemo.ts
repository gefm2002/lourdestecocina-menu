import baseSite from "./site.json";
import baseMediodia from "./menu.mediadia.json";
import baseNocturno from "./menu.nocturno.json";
import type {
  Institution,
  InstitutionUser,
  InstitutionalMenu,
  InstitutionalMenuDay,
  InstitutionalMenuOption,
  InstitutionalOrder,
  MenuData,
  Product,
  ProductionStatusMap,
  SiteData,
  Weekday,
} from "../types";
import {
  addDays,
  buildProductionKey,
  createId,
  getMenuCalendar,
  getWeekdayForDate,
  startOfWeek,
  toISODate,
} from "../utils/institutional";

export type DemoSeedBundle = {
  site: SiteData;
  menuMediodia: MenuData;
  menuNocturno: MenuData;
  institutions: Institution[];
  institutionUsers: InstitutionUser[];
  products: Product[];
  institutionalMenus: InstitutionalMenu[];
  institutionalOrders: InstitutionalOrder[];
  productionStatuses: ProductionStatusMap;
};

const buildDemoProducts = (): Product[] => [
  {
    id: "milanesa-pure",
    name: "Milanesa con puré",
    description: "Milanesa al horno con puré mixto",
    type: "plato",
    publicPrice: 6200,
    isActive: true,
    unit: "porción",
  },
  {
    id: "pastas-bolognesa",
    name: "Pastas con salsa bolognesa",
    description: "Tallarines con salsa casera",
    type: "plato",
    publicPrice: 5900,
    isActive: true,
    unit: "porción",
  },
  {
    id: "lasagna-vegetal",
    name: "Lasaña vegetal",
    description: "Lasaña de verdura y bechamel",
    type: "plato",
    publicPrice: 6100,
    isActive: true,
    unit: "porción",
  },
  {
    id: "pollo-arroz-integral",
    name: "Pollo con arroz integral",
    description: "Pollo grillado con arroz y vegetales",
    type: "plato",
    publicPrice: 5600,
    isActive: true,
    unit: "porción",
  },
  {
    id: "wrap-pollo-hummus",
    name: "Wrap de pollo y hummus",
    description: "Producto creado en planificación rápida",
    type: "plato",
    publicPrice: 5800,
    isActive: true,
    unit: "unidad",
  },
  {
    id: "crema-zapallo",
    name: "Crema de zapallo",
    description: "Sopa suave con crocante de semillas",
    type: "otro",
    publicPrice: 2800,
    isActive: true,
    unit: "porción",
  },
  {
    id: "ensalada-caesar",
    name: "Ensalada Caesar",
    description: "Mix verde, pollo y croutons",
    type: "guarnicion",
    publicPrice: 3200,
    isActive: true,
    unit: "porción",
  },
  {
    id: "brownie-cacao",
    name: "Brownie de cacao",
    description: "Brownie húmedo con nueces",
    type: "postre",
    publicPrice: 1900,
    isActive: true,
    unit: "unidad",
  },
  {
    id: "fruta-estacion",
    name: "Fruta de estación",
    description: "Selección de fruta fresca",
    type: "postre",
    publicPrice: 1500,
    isActive: true,
    unit: "unidad",
  },
  {
    id: "yogur-granola",
    name: "Yogur con granola",
    description: "Yogur natural con topping crocante",
    type: "postre",
    publicPrice: 1700,
    isActive: true,
    unit: "unidad",
  },
  {
    id: "budin-banana",
    name: "Budín de banana",
    description: "Producto creado al armar menú mensual",
    type: "postre",
    publicPrice: 1800,
    isActive: true,
    unit: "porción",
  },
  {
    id: "agua-saborizada",
    name: "Agua saborizada",
    description: "Botella individual",
    type: "bebida",
    publicPrice: 1200,
    isActive: true,
    unit: "botella",
  },
  {
    id: "jugo-naranja",
    name: "Jugo de naranja",
    description: "Jugo exprimido",
    type: "bebida",
    publicPrice: 1500,
    isActive: true,
    unit: "vaso",
  },
  {
    id: "limonada-menta",
    name: "Limonada con menta",
    description: "Limonada casera",
    type: "bebida",
    publicPrice: 1300,
    isActive: true,
    unit: "vaso",
  },
];

const buildDemoInstitutions = (): Institution[] => [
  {
    id: "colegio-nueva-estrella",
    name: "Colegio Nueva Estrella",
    address: "Av. Rivadavia 1200, Caballito",
    type: "educativa",
    isActive: true,
  },
  {
    id: "instituto-san-jorge",
    name: "Instituto San Jorge",
    address: "José Bonifacio 775, Flores",
    type: "educativa",
    isActive: true,
  },
  {
    id: "fundacion-amanecer",
    name: "Fundación Amanecer",
    address: "Moreno 3250, Almagro",
    type: "otras",
    isActive: true,
  },
];

const buildDemoUsers = (today: Date): InstitutionUser[] => [
  {
    id: "usr-maria-paz",
    firstName: "María",
    lastName: "Paz",
    email: "maria.paz@nuevaestrella.edu.ar",
    phone: "11 4555 2201",
    institutionId: "colegio-nueva-estrella",
    username: "mpaz",
    password: "demo1234",
    status: "approved",
    createdAt: toISODate(addDays(today, -20)),
    approvedAt: toISODate(addDays(today, -18)),
    approvedBy: "admin",
  },
  {
    id: "usr-juan-ramos",
    firstName: "Juan",
    lastName: "Ramos",
    email: "jramos@institutosanjorge.edu.ar",
    phone: "11 4999 1122",
    institutionId: "instituto-san-jorge",
    username: "jramos",
    password: "demo1234",
    status: "approved",
    createdAt: toISODate(addDays(today, -16)),
    approvedAt: toISODate(addDays(today, -15)),
    approvedBy: "admin",
  },
  {
    id: "usr-lucia-mora",
    firstName: "Lucía",
    lastName: "Mora",
    email: "lmora@fundacionamanecer.org",
    phone: "11 4777 8899",
    institutionId: "fundacion-amanecer",
    username: "lmora",
    password: "demo1234",
    status: "pending",
    createdAt: toISODate(addDays(today, -2)),
  },
  {
    id: "usr-sergio-ibarra",
    firstName: "Sergio",
    lastName: "Ibarra",
    email: "sibarra@nuevaestrella.edu.ar",
    phone: "11 4888 1100",
    institutionId: "colegio-nueva-estrella",
    username: "sibarra",
    password: "demo1234",
    status: "rejected",
    createdAt: toISODate(addDays(today, -9)),
    approvedAt: toISODate(addDays(today, -7)),
    approvedBy: "admin",
  },
];

const buildOption =
  (productsById: Map<string, Product>) =>
  (
    productId: string,
    menuPrice: number,
    source: InstitutionalMenuOption["source"] = "catalog"
  ): InstitutionalMenuOption => {
    const product = productsById.get(productId);
    if (!product) {
      throw new Error(`Producto demo no encontrado: ${productId}`);
    }

    return {
      id: createId("option"),
      productId: product.id,
      name: product.name,
      description: product.description,
      itemType: product.type,
      menuPrice,
      source,
    };
  };

const buildSections = (
  weekday: Weekday,
  productsById: Map<string, Product>,
  mainOptions: Array<[string, number, InstitutionalMenuOption["source"]?]>,
  dessertOptions: Array<[string, number, InstitutionalMenuOption["source"]?]>,
  drinkOptions: Array<[string, number, InstitutionalMenuOption["source"]?]>
): InstitutionalMenuDay => {
  const option = buildOption(productsById);

  return {
    weekday,
    sections: [
      {
        id: `${weekday}-plato`,
        name: "Plato principal",
        itemType: "plato",
        selectionLimit: 1,
        options: mainOptions.map(([productId, price, source]) => option(productId, price, source)),
      },
      {
        id: `${weekday}-postre`,
        name: "Postre",
        itemType: "postre",
        selectionLimit: 1,
        options: dessertOptions.map(([productId, price, source]) =>
          option(productId, price, source)
        ),
      },
      {
        id: `${weekday}-bebida`,
        name: "Bebida",
        itemType: "bebida",
        selectionLimit: 1,
        options: drinkOptions.map(([productId, price, source]) => option(productId, price, source)),
      },
    ],
  };
};

const buildMenus = (today: Date, products: Product[]): InstitutionalMenu[] => {
  const monday = startOfWeek(today);
  const activeStart = toISODate(monday);
  const activeEnd = toISODate(addDays(monday, 11));
  const sanJorgeEnd = toISODate(addDays(monday, 4));
  const upcomingStart = toISODate(addDays(monday, 14));
  const upcomingEnd = toISODate(addDays(monday, 41));
  const productsById = new Map(products.map((product) => [product.id, product]));

  return [
    {
      id: "menu-nueva-estrella-activo",
      institutionId: "colegio-nueva-estrella",
      name: "Plan quincenal abril - Nueva Estrella",
      cycle: "biweekly",
      startDate: activeStart,
      endDate: activeEnd,
      isActive: true,
      createdAt: toISODate(addDays(today, -10)),
      days: [
        buildSections(
          "monday",
          productsById,
          [
            ["milanesa-pure", 5200],
            ["wrap-pollo-hummus", 5000, "inline"],
          ],
          [
            ["brownie-cacao", 1500],
            ["fruta-estacion", 1200],
          ],
          [
            ["agua-saborizada", 900],
            ["limonada-menta", 1100],
          ]
        ),
        buildSections(
          "tuesday",
          productsById,
          [
            ["pastas-bolognesa", 5100],
            ["lasagna-vegetal", 5000],
          ],
          [
            ["yogur-granola", 1400],
            ["fruta-estacion", 1200],
          ],
          [
            ["agua-saborizada", 900],
            ["jugo-naranja", 1200],
          ]
        ),
        buildSections(
          "wednesday",
          productsById,
          [
            ["pollo-arroz-integral", 4950],
            ["milanesa-pure", 5200],
          ],
          [
            ["brownie-cacao", 1500],
            ["budin-banana", 1450, "inline"],
          ],
          [
            ["limonada-menta", 1100],
            ["jugo-naranja", 1200],
          ]
        ),
        buildSections(
          "thursday",
          productsById,
          [
            ["lasagna-vegetal", 5000],
            ["wrap-pollo-hummus", 5000, "inline"],
          ],
          [
            ["fruta-estacion", 1200],
            ["yogur-granola", 1400],
          ],
          [
            ["agua-saborizada", 900],
            ["jugo-naranja", 1200],
          ]
        ),
        buildSections(
          "friday",
          productsById,
          [
            ["milanesa-pure", 5200],
            ["pastas-bolognesa", 5100],
          ],
          [
            ["brownie-cacao", 1500],
            ["budin-banana", 1450, "inline"],
          ],
          [
            ["limonada-menta", 1100],
            ["agua-saborizada", 900],
          ]
        ),
      ],
    },
    {
      id: "menu-san-jorge-activo",
      institutionId: "instituto-san-jorge",
      name: "Plan semanal staff docente",
      cycle: "weekly",
      startDate: activeStart,
      endDate: sanJorgeEnd,
      isActive: true,
      createdAt: toISODate(addDays(today, -7)),
      days: [
        buildSections(
          "monday",
          productsById,
          [
            ["pollo-arroz-integral", 4800],
            ["lasagna-vegetal", 4900],
          ],
          [
            ["fruta-estacion", 1100],
            ["yogur-granola", 1350],
          ],
          [
            ["agua-saborizada", 900],
            ["jugo-naranja", 1200],
          ]
        ),
        buildSections(
          "tuesday",
          productsById,
          [
            ["milanesa-pure", 5050],
            ["pastas-bolognesa", 4950],
          ],
          [
            ["brownie-cacao", 1450],
            ["fruta-estacion", 1100],
          ],
          [
            ["limonada-menta", 1000],
            ["agua-saborizada", 900],
          ]
        ),
        buildSections(
          "wednesday",
          productsById,
          [
            ["wrap-pollo-hummus", 4850, "inline"],
            ["pollo-arroz-integral", 4800],
          ],
          [
            ["yogur-granola", 1350],
            ["budin-banana", 1400, "inline"],
          ],
          [
            ["jugo-naranja", 1200],
            ["agua-saborizada", 900],
          ]
        ),
        buildSections(
          "thursday",
          productsById,
          [
            ["lasagna-vegetal", 4900],
            ["milanesa-pure", 5050],
          ],
          [
            ["fruta-estacion", 1100],
            ["brownie-cacao", 1450],
          ],
          [
            ["limonada-menta", 1000],
            ["agua-saborizada", 900],
          ]
        ),
        buildSections(
          "friday",
          productsById,
          [
            ["pastas-bolognesa", 4950],
            ["pollo-arroz-integral", 4800],
          ],
          [
            ["budin-banana", 1400, "inline"],
            ["fruta-estacion", 1100],
          ],
          [
            ["jugo-naranja", 1200],
            ["agua-saborizada", 900],
          ]
        ),
      ],
    },
    {
      id: "menu-fundacion-amanecer-proximo",
      institutionId: "fundacion-amanecer",
      name: "Plan mensual acompañamiento",
      cycle: "monthly",
      startDate: upcomingStart,
      endDate: upcomingEnd,
      isActive: true,
      createdAt: toISODate(today),
      days: [
        buildSections(
          "monday",
          productsById,
          [
            ["crema-zapallo", 2500, "inline"],
            ["lasagna-vegetal", 4900],
          ],
          [
            ["fruta-estacion", 1100],
            ["budin-banana", 1400, "inline"],
          ],
          [
            ["agua-saborizada", 900],
            ["limonada-menta", 1000],
          ]
        ),
        buildSections(
          "tuesday",
          productsById,
          [
            ["milanesa-pure", 5100],
            ["wrap-pollo-hummus", 4950, "inline"],
          ],
          [
            ["brownie-cacao", 1450],
            ["fruta-estacion", 1100],
          ],
          [
            ["jugo-naranja", 1200],
            ["agua-saborizada", 900],
          ]
        ),
        buildSections(
          "wednesday",
          productsById,
          [
            ["pastas-bolognesa", 4950],
            ["pollo-arroz-integral", 4800],
          ],
          [
            ["yogur-granola", 1350],
            ["budin-banana", 1400, "inline"],
          ],
          [
            ["limonada-menta", 1000],
            ["agua-saborizada", 900],
          ]
        ),
        buildSections(
          "thursday",
          productsById,
          [
            ["lasagna-vegetal", 4900],
            ["crema-zapallo", 2500, "inline"],
          ],
          [
            ["fruta-estacion", 1100],
            ["brownie-cacao", 1450],
          ],
          [
            ["jugo-naranja", 1200],
            ["agua-saborizada", 900],
          ]
        ),
        buildSections(
          "friday",
          productsById,
          [
            ["wrap-pollo-hummus", 4950, "inline"],
            ["milanesa-pure", 5100],
          ],
          [
            ["budin-banana", 1400, "inline"],
            ["fruta-estacion", 1100],
          ],
          [
            ["limonada-menta", 1000],
            ["agua-saborizada", 900],
          ]
        ),
      ],
    },
  ];
};

const buildSeedOrders = (menus: InstitutionalMenu[]): InstitutionalOrder[] => {
  const nuevaEstrellaMenu = menus.find((menu) => menu.id === "menu-nueva-estrella-activo");
  const sanJorgeMenu = menus.find((menu) => menu.id === "menu-san-jorge-activo");

  if (!nuevaEstrellaMenu || !sanJorgeMenu) {
    return [];
  }

  const nuevaCalendar = getMenuCalendar(nuevaEstrellaMenu);
  const sanJorgeCalendar = getMenuCalendar(sanJorgeMenu);

  const mondayNueva = nuevaCalendar[0];
  const tuesdayNueva = nuevaCalendar[1];
  const mondaySanJorge = sanJorgeCalendar[0];

  const makeSelection = (
    date: string,
    sectionId: string,
    sectionName: string,
    productId: string,
    name: string,
    itemType: InstitutionalOrder["selections"][number]["itemType"],
    unitPrice: number
  ) => ({
    date,
    weekday: getWeekdayForDate(date) ?? "monday",
    sectionId,
    sectionName,
    optionId: createId("selection"),
    productId,
    name,
    itemType,
    unitPrice,
  });

  return [
    {
      id: "order-demo-001",
      institutionId: "colegio-nueva-estrella",
      userId: "usr-maria-paz",
      menuId: nuevaEstrellaMenu.id,
      createdAt: `${mondayNueva.date}T08:30:00`,
      total: 15100,
      status: "sent-whatsapp",
      selections: [
        makeSelection(
          mondayNueva.date,
          "monday-plato",
          "Plato principal",
          "milanesa-pure",
          "Milanesa con puré",
          "plato",
          5200
        ),
        makeSelection(
          mondayNueva.date,
          "monday-postre",
          "Postre",
          "brownie-cacao",
          "Brownie de cacao",
          "postre",
          1500
        ),
        makeSelection(
          mondayNueva.date,
          "monday-bebida",
          "Bebida",
          "agua-saborizada",
          "Agua saborizada",
          "bebida",
          900
        ),
        makeSelection(
          tuesdayNueva.date,
          "tuesday-plato",
          "Plato principal",
          "pastas-bolognesa",
          "Pastas con salsa bolognesa",
          "plato",
          5100
        ),
        makeSelection(
          tuesdayNueva.date,
          "tuesday-postre",
          "Postre",
          "fruta-estacion",
          "Fruta de estación",
          "postre",
          1200
        ),
        makeSelection(
          tuesdayNueva.date,
          "tuesday-bebida",
          "Bebida",
          "jugo-naranja",
          "Jugo de naranja",
          "bebida",
          1200
        ),
      ],
    },
    {
      id: "order-demo-002",
      institutionId: "instituto-san-jorge",
      userId: "usr-juan-ramos",
      menuId: sanJorgeMenu.id,
      createdAt: `${mondaySanJorge.date}T09:00:00`,
      total: 7350,
      status: "confirmed",
      selections: [
        makeSelection(
          mondaySanJorge.date,
          "monday-plato",
          "Plato principal",
          "pollo-arroz-integral",
          "Pollo con arroz integral",
          "plato",
          4800
        ),
        makeSelection(
          mondaySanJorge.date,
          "monday-postre",
          "Postre",
          "yogur-granola",
          "Yogur con granola",
          "postre",
          1350
        ),
        makeSelection(
          mondaySanJorge.date,
          "monday-bebida",
          "Bebida",
          "jugo-naranja",
          "Jugo de naranja",
          "bebida",
          1200
        ),
      ],
    },
  ];
};

const buildSeedProductionStatuses = (orders: InstitutionalOrder[]): ProductionStatusMap => {
  const statuses: ProductionStatusMap = {};

  orders.forEach((order, index) => {
    order.selections.forEach((selection) => {
      const key = buildProductionKey(selection.date, selection.productId);
      if (index === 0 && selection.itemType === "plato") {
        statuses[key] = "in-progress";
      } else if (selection.itemType === "bebida") {
        statuses[key] = "ready";
      } else {
        statuses[key] = "pending";
      }
    });
  });

  return statuses;
};

export const buildDemoSeeds = (): DemoSeedBundle => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const products = buildDemoProducts();
  const institutionalMenus = buildMenus(today, products);
  const institutionalOrders = buildSeedOrders(institutionalMenus);

  return {
    site: baseSite as SiteData,
    menuMediodia: baseMediodia as MenuData,
    menuNocturno: baseNocturno as MenuData,
    institutions: buildDemoInstitutions(),
    institutionUsers: buildDemoUsers(today),
    products,
    institutionalMenus,
    institutionalOrders,
    productionStatuses: buildSeedProductionStatuses(institutionalOrders),
  };
};
