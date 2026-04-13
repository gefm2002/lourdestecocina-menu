/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { buildDemoSeeds } from "../data/institutionalDemo";
import type {
  Institution,
  InstitutionUser,
  InstitutionalMenu,
  InstitutionalOrder,
  PortalSession,
  Product,
  ProductionStatusMap,
  SiteData,
  MenuData,
  UserApprovalStatus,
} from "../types";
import { createId, slugify } from "./institutional";
import { useStoredState } from "./storage";

type Setter<T> = Dispatch<SetStateAction<T>>;

type RegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institutionId: string;
  username: string;
  password: string;
};

type OrderInput = {
  menuId: string;
  institutionId: string;
  selections: InstitutionalOrder["selections"];
};

type DataContextValue = {
  site: SiteData;
  setSite: Setter<SiteData>;
  menuMediodia: MenuData;
  setMenuMediodia: Setter<MenuData>;
  menuNocturno: MenuData;
  setMenuNocturno: Setter<MenuData>;
  institutions: Institution[];
  setInstitutions: Setter<Institution[]>;
  institutionUsers: InstitutionUser[];
  setInstitutionUsers: Setter<InstitutionUser[]>;
  products: Product[];
  setProducts: Setter<Product[]>;
  institutionalMenus: InstitutionalMenu[];
  setInstitutionalMenus: Setter<InstitutionalMenu[]>;
  institutionalOrders: InstitutionalOrder[];
  setInstitutionalOrders: Setter<InstitutionalOrder[]>;
  productionStatuses: ProductionStatusMap;
  setProductionStatuses: Setter<ProductionStatusMap>;
  portalSession: PortalSession | null;
  currentPortalUser: InstitutionUser | null;
  registerInstitutionalUser: (input: RegistrationInput) => { ok: true } | { ok: false; error: string };
  loginInstitutionalUser: (
    usernameOrEmail: string,
    password: string
  ) => { ok: true } | { ok: false; error: string };
  logoutInstitutionalUser: () => void;
  changeInstitutionUserStatus: (userId: string, status: UserApprovalStatus) => void;
  saveProduct: (product: Product) => void;
  createInstitutionalOrder: (input: OrderInput) =>
    | { ok: true; order: InstitutionalOrder }
    | { ok: false; error: string };
  resetDemoData: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

const defaultSeeds = buildDemoSeeds();

const SITE_KEY = "lourdestecocina:site";
const MENU_MEDIODIA_KEY = "lourdestecocina:menu:mediodia";
const MENU_NOCTURNO_KEY = "lourdestecocina:menu:nocturno";
const INSTITUTIONS_KEY = "lourdestecocina:institutions";
const INSTITUTION_USERS_KEY = "lourdestecocina:institution:users";
const PRODUCTS_KEY = "lourdestecocina:institution:products";
const INSTITUTIONAL_MENUS_KEY = "lourdestecocina:institution:menus";
const INSTITUTIONAL_ORDERS_KEY = "lourdestecocina:institution:orders";
const PRODUCTION_STATUSES_KEY = "lourdestecocina:institution:production";
const PORTAL_AUTH_KEY = "lourdestecocina:portal:auth";

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [site, setSite] = useStoredState<SiteData>(SITE_KEY, defaultSeeds.site);
  const [menuMediodia, setMenuMediodia] = useStoredState<MenuData>(
    MENU_MEDIODIA_KEY,
    defaultSeeds.menuMediodia
  );
  const [menuNocturno, setMenuNocturno] = useStoredState<MenuData>(
    MENU_NOCTURNO_KEY,
    defaultSeeds.menuNocturno
  );
  const [institutions, setInstitutions] = useStoredState<Institution[]>(
    INSTITUTIONS_KEY,
    defaultSeeds.institutions
  );
  const [institutionUsers, setInstitutionUsers] = useStoredState<InstitutionUser[]>(
    INSTITUTION_USERS_KEY,
    defaultSeeds.institutionUsers
  );
  const [products, setProducts] = useStoredState<Product[]>(PRODUCTS_KEY, defaultSeeds.products);
  const [institutionalMenus, setInstitutionalMenus] = useStoredState<InstitutionalMenu[]>(
    INSTITUTIONAL_MENUS_KEY,
    defaultSeeds.institutionalMenus
  );
  const [institutionalOrders, setInstitutionalOrders] = useStoredState<InstitutionalOrder[]>(
    INSTITUTIONAL_ORDERS_KEY,
    defaultSeeds.institutionalOrders
  );
  const [productionStatuses, setProductionStatuses] = useStoredState<ProductionStatusMap>(
    PRODUCTION_STATUSES_KEY,
    defaultSeeds.productionStatuses
  );
  const [portalSession, setPortalSession] = useStoredState<PortalSession | null>(
    PORTAL_AUTH_KEY,
    null
  );

  const currentPortalUser = useMemo(
    () =>
      portalSession
        ? institutionUsers.find((user) => user.id === portalSession.userId) ?? null
        : null,
    [institutionUsers, portalSession]
  );

  const registerInstitutionalUser = (input: RegistrationInput) => {
    const normalizedEmail = input.email.trim().toLowerCase();
    const normalizedUsername = slugify(input.username.trim() || input.email.split("@")[0]);

    if (!institutions.some((institution) => institution.id === input.institutionId && institution.isActive)) {
      return { ok: false as const, error: "La institución seleccionada no está disponible." };
    }

    if (institutionUsers.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false as const, error: "Ya existe un usuario con ese email." };
    }

    if (institutionUsers.some((user) => user.username.toLowerCase() === normalizedUsername)) {
      return { ok: false as const, error: "Ese usuario ya está tomado." };
    }

    const user: InstitutionUser = {
      id: createId("usr"),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: normalizedEmail,
      phone: input.phone.trim(),
      institutionId: input.institutionId,
      username: normalizedUsername,
      password: input.password,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setInstitutionUsers((prev) => [...prev, user]);
    setPortalSession({ userId: user.id });

    return { ok: true as const };
  };

  const loginInstitutionalUser = (usernameOrEmail: string, password: string) => {
    const normalizedInput = usernameOrEmail.trim().toLowerCase();
    const user = institutionUsers.find(
      (entry) =>
        (entry.username.toLowerCase() === normalizedInput || entry.email.toLowerCase() === normalizedInput) &&
        entry.password === password
    );

    if (!user) {
      return { ok: false as const, error: "Usuario/email o contraseña incorrectos." };
    }

    setPortalSession({ userId: user.id });
    return { ok: true as const };
  };

  const logoutInstitutionalUser = () => {
    setPortalSession(null);
  };

  const changeInstitutionUserStatus = (userId: string, status: UserApprovalStatus) => {
    setInstitutionUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status,
              approvedAt: status === "pending" ? undefined : new Date().toISOString(),
              approvedBy: status === "pending" ? undefined : "admin",
            }
          : user
      )
    );
  };

  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (!exists) return [...prev, product];
      return prev.map((item) => (item.id === product.id ? product : item));
    });
  };

  const createInstitutionalOrder = (input: OrderInput) => {
    if (!currentPortalUser) {
      return { ok: false as const, error: "Necesitás iniciar sesión para generar la orden." };
    }

    if (currentPortalUser.status !== "approved") {
      return { ok: false as const, error: "Tu usuario todavía no está aprobado." };
    }

    if (input.selections.length === 0) {
      return { ok: false as const, error: "Seleccioná al menos una opción del menú." };
    }

    const total = input.selections.reduce((acc, selection) => acc + selection.unitPrice, 0);
    const order: InstitutionalOrder = {
      id: createId("order"),
      institutionId: input.institutionId,
      userId: currentPortalUser.id,
      menuId: input.menuId,
      createdAt: new Date().toISOString(),
      total,
      status: "sent-whatsapp",
      selections: input.selections,
    };

    setInstitutionalOrders((prev) => [order, ...prev]);
    setProductionStatuses((prev) => {
      const next = { ...prev };
      input.selections.forEach((selection) => {
        const key = `${selection.date}::${selection.productId}`;
        next[key] = next[key] ?? "pending";
      });
      return next;
    });

    return { ok: true as const, order };
  };

  const resetDemoData = () => {
    const nextSeeds = buildDemoSeeds();
    setSite(nextSeeds.site);
    setMenuMediodia(nextSeeds.menuMediodia);
    setMenuNocturno(nextSeeds.menuNocturno);
    setInstitutions(nextSeeds.institutions);
    setInstitutionUsers(nextSeeds.institutionUsers);
    setProducts(nextSeeds.products);
    setInstitutionalMenus(nextSeeds.institutionalMenus);
    setInstitutionalOrders(nextSeeds.institutionalOrders);
    setProductionStatuses(nextSeeds.productionStatuses);
    setPortalSession(null);
  };

  return (
    <DataContext.Provider
      value={{
        site,
        setSite,
        menuMediodia,
        setMenuMediodia,
        menuNocturno,
        setMenuNocturno,
        institutions,
        setInstitutions,
        institutionUsers,
        setInstitutionUsers,
        products,
        setProducts,
        institutionalMenus,
        setInstitutionalMenus,
        institutionalOrders,
        setInstitutionalOrders,
        productionStatuses,
        setProductionStatuses,
        portalSession,
        currentPortalUser,
        registerInstitutionalUser,
        loginInstitutionalUser,
        logoutInstitutionalUser,
        changeInstitutionUserStatus,
        saveProduct,
        createInstitutionalOrder,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return context;
};
