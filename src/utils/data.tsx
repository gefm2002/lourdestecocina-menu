import { createContext, useContext } from "react";
import baseSite from "../data/site.json";
import baseMediodia from "../data/menu.mediadia.json";
import baseNocturno from "../data/menu.nocturno.json";
import type { MenuData, SiteData } from "../types";
import { useStoredState } from "./storage";

type DataContextValue = {
  site: SiteData;
  setSite: (value: SiteData) => void;
  menuMediodia: MenuData;
  setMenuMediodia: (value: MenuData) => void;
  menuNocturno: MenuData;
  setMenuNocturno: (value: MenuData) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

const SITE_KEY = "lourdestecocina:site";
const MENU_MEDIODIA_KEY = "lourdestecocina:menu:mediodia";
const MENU_NOCTURNO_KEY = "lourdestecocina:menu:nocturno";

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [site, setSite] = useStoredState<SiteData>(SITE_KEY, baseSite);
  const [menuMediodia, setMenuMediodia] = useStoredState<MenuData>(
    MENU_MEDIODIA_KEY,
    baseMediodia
  );
  const [menuNocturno, setMenuNocturno] = useStoredState<MenuData>(
    MENU_NOCTURNO_KEY,
    baseNocturno
  );

  return (
    <DataContext.Provider
      value={{ site, setSite, menuMediodia, setMenuMediodia, menuNocturno, setMenuNocturno }}
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
