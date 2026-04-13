import { useState } from "react";
import type {
  Institution,
  InstitutionUser,
  InstitutionalMenu,
  InstitutionalOrder,
  MenuData,
  Product,
  ProductionStatusMap,
  SiteData,
} from "../types";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type AdminExportProps = {
  site: SiteData;
  menuMediodia: MenuData;
  menuNocturno: MenuData;
  institutions: Institution[];
  institutionUsers: InstitutionUser[];
  products: Product[];
  institutionalMenus: InstitutionalMenu[];
  institutionalOrders: InstitutionalOrder[];
  productionStatuses: ProductionStatusMap;
  setSite: Setter<SiteData>;
  setMenuMediodia: Setter<MenuData>;
  setMenuNocturno: Setter<MenuData>;
  setInstitutions: Setter<Institution[]>;
  setInstitutionUsers: Setter<InstitutionUser[]>;
  setProducts: Setter<Product[]>;
  setInstitutionalMenus: Setter<InstitutionalMenu[]>;
  setInstitutionalOrders: Setter<InstitutionalOrder[]>;
  setProductionStatuses: Setter<ProductionStatusMap>;
  onResetDemo: () => void;
};

const downloadJson = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const AdminExport = ({
  site,
  menuMediodia,
  menuNocturno,
  institutions,
  institutionUsers,
  products,
  institutionalMenus,
  institutionalOrders,
  productionStatuses,
  setSite,
  setMenuMediodia,
  setMenuNocturno,
  setInstitutions,
  setInstitutionUsers,
  setProducts,
  setInstitutionalMenus,
  setInstitutionalOrders,
  setProductionStatuses,
  onResetDemo,
}: AdminExportProps) => {
  const [payload, setPayload] = useState("");
  const [target, setTarget] = useState<
    | "full"
    | "site"
    | "mediodia"
    | "nocturno"
    | "institutions"
    | "users"
    | "products"
    | "menus"
    | "orders"
    | "production"
  >("full");
  const [error, setError] = useState("");

  const fullPayload = {
    site,
    menuMediodia,
    menuNocturno,
    institutions,
    institutionUsers,
    products,
    institutionalMenus,
    institutionalOrders,
    productionStatuses,
  };

  const handleImport = () => {
    setError("");
    try {
      const parsed = JSON.parse(payload);
      if (target === "full") {
        setSite(parsed.site);
        setMenuMediodia(parsed.menuMediodia);
        setMenuNocturno(parsed.menuNocturno);
        setInstitutions(parsed.institutions);
        setInstitutionUsers(parsed.institutionUsers);
        setProducts(parsed.products);
        setInstitutionalMenus(parsed.institutionalMenus);
        setInstitutionalOrders(parsed.institutionalOrders);
        setProductionStatuses(parsed.productionStatuses);
      } else if (target === "site") {
        setSite(parsed);
      } else if (target === "mediodia") {
        setMenuMediodia(parsed);
      } else if (target === "nocturno") {
        setMenuNocturno(parsed);
      } else if (target === "institutions") {
        setInstitutions(parsed);
      } else if (target === "users") {
        setInstitutionUsers(parsed);
      } else if (target === "products") {
        setProducts(parsed);
      } else if (target === "menus") {
        setInstitutionalMenus(parsed);
      } else if (target === "orders") {
        setInstitutionalOrders(parsed);
      } else {
        setProductionStatuses(parsed);
      }
      setPayload("");
    } catch {
      setError("El JSON no es válido.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">Importar / Exportar</h2>
        <p className="text-sm text-muted">
          Respaldá la demo completa o resembrá los datos base.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          onClick={() => downloadJson("demo-completo.json", fullPayload)}
        >
          Exportar demo completa
        </button>
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          onClick={() => downloadJson("instituciones.json", institutions)}
        >
          Exportar instituciones
        </button>
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          onClick={() => downloadJson("productos-institucionales.json", products)}
        >
          Exportar productos
        </button>
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          onClick={() => downloadJson("menus-institucionales.json", institutionalMenus)}
        >
          Exportar menús instituciones
        </button>
      </div>

      <div className="rounded-ui border border-black/10 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">Reset demo</p>
            <p className="text-xs text-muted">
              Restaura seeds de instituciones, usuarios, menús, órdenes y producción.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
            onClick={onResetDemo}
          >
            Restaurar demo
          </button>
        </div>
      </div>

      <div className="rounded-ui border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-primary">Importar JSON</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["full", "Demo completa"],
            ["institutions", "Instituciones"],
            ["users", "Usuarios"],
            ["products", "Productos"],
            ["menus", "Menús"],
            ["orders", "Órdenes"],
            ["production", "Producción"],
            ["site", "Sitio"],
            ["mediodia", "Medio día"],
            ["nocturno", "Nocturno"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                target === value ? "bg-primary text-white" : "border border-black/10"
              }`}
              onClick={() => setTarget(value as typeof target)}
            >
              {label}
            </button>
          ))}
        </div>
        <textarea
          className="mt-3 min-h-[180px] w-full rounded-2xl border border-black/10 px-3 py-2 text-sm"
          placeholder="Pegá el JSON acá"
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
        />
        {error && <p className="mt-2 text-xs text-accent">{error}</p>}
        <button
          type="button"
          className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={handleImport}
        >
          Importar
        </button>
      </div>
    </section>
  );
};
