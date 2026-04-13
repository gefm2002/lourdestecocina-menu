import { useState } from "react";
import { AdminExport } from "./AdminExport";
import { AdminInstitutionManager } from "./AdminInstitutionManager";
import { AdminInstitutionUsers } from "./AdminInstitutionUsers";
import { AdminInstitutionalMenus } from "./AdminInstitutionalMenus";
import { AdminInstitutionalReports } from "./AdminInstitutionalReports";
import { AdminKitchenBoard } from "./AdminKitchenBoard";
import { AdminLogin } from "./AdminLogin";
import { AdminMenuEditor } from "./AdminMenuEditor";
import { AdminProductCatalog } from "./AdminProductCatalog";
import { AdminSiteEditor } from "./AdminSiteEditor";
import { useData } from "../utils/data";
import { readStorage, removeStorage } from "../utils/storage";

const AUTH_KEY = "lourdestecocina:admin:auth";

type View =
  | "mediodia"
  | "nocturno"
  | "site"
  | "institutions"
  | "users"
  | "products"
  | "institutional-menus"
  | "reports"
  | "kitchen"
  | "export";

export const AdminLayout = () => {
  const {
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
    changeInstitutionUserStatus,
    saveProduct,
    resetDemoData,
  } = useData();
  const [isAuth, setIsAuth] = useState(() => readStorage(AUTH_KEY, false));
  const [view, setView] = useState<View>("institutions");

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-secondary px-4 py-10">
        <AdminLogin onSuccess={() => setIsAuth(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-ui border border-black/10 bg-white p-4">
          <p className="text-sm font-semibold text-primary">Admin Lourdes</p>
          <p className="mt-1 text-xs text-muted">Panel demo institucional + portal público</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm">
            <AdminNavButton label="Instituciones" view="institutions" currentView={view} onClick={setView} />
            <AdminNavButton label="Usuarios" view="users" currentView={view} onClick={setView} />
            <AdminNavButton label="Productos" view="products" currentView={view} onClick={setView} />
            <AdminNavButton
              label="Menús instituciones"
              view="institutional-menus"
              currentView={view}
              onClick={setView}
            />
            <AdminNavButton label="Reportes" view="reports" currentView={view} onClick={setView} />
            <AdminNavButton label="Producción" view="kitchen" currentView={view} onClick={setView} />
            <AdminNavButton label="Medio día" view="mediodia" currentView={view} onClick={setView} />
            <AdminNavButton label="Nocturno" view="nocturno" currentView={view} onClick={setView} />
            <AdminNavButton label="Sitio" view="site" currentView={view} onClick={setView} />
            <AdminNavButton label="Exportar" view="export" currentView={view} onClick={setView} />
          </nav>
          <button
            type="button"
            className="mt-6 w-full rounded-full border border-black/10 px-3 py-2 text-sm text-muted"
            onClick={() => {
              removeStorage(AUTH_KEY);
              setIsAuth(false);
            }}
          >
            Cerrar sesión
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="mt-3 inline-flex w-full justify-center rounded-full border border-primary px-3 py-2 text-sm font-semibold text-primary"
          >
            Vista previa cliente
          </a>
        </aside>

        <div className="space-y-6">
          {view === "institutions" && (
            <AdminInstitutionManager
              institutions={institutions}
              setInstitutions={setInstitutions}
            />
          )}
          {view === "users" && (
            <AdminInstitutionUsers
              institutions={institutions}
              users={institutionUsers}
              setUsers={setInstitutionUsers}
              onChangeStatus={changeInstitutionUserStatus}
            />
          )}
          {view === "products" && (
            <AdminProductCatalog
              products={products}
              saveProduct={saveProduct}
              setProducts={setProducts}
            />
          )}
          {view === "institutional-menus" && (
            <AdminInstitutionalMenus
              institutions={institutions}
              products={products}
              menus={institutionalMenus}
              setMenus={setInstitutionalMenus}
              saveProduct={saveProduct}
            />
          )}
          {view === "reports" && (
            <AdminInstitutionalReports
              institutions={institutions}
              users={institutionUsers}
              orders={institutionalOrders}
            />
          )}
          {view === "kitchen" && (
            <AdminKitchenBoard
              institutions={institutions}
              orders={institutionalOrders}
              productionStatuses={productionStatuses}
              setProductionStatuses={setProductionStatuses}
            />
          )}
          {view === "mediodia" && (
            <AdminMenuEditor
              title="Menú medio día"
              menu={menuMediodia}
              setMenu={setMenuMediodia}
            />
          )}
          {view === "nocturno" && (
            <AdminMenuEditor
              title="Carta nocturna"
              menu={menuNocturno}
              setMenu={setMenuNocturno}
            />
          )}
          {view === "site" && <AdminSiteEditor site={site} setSite={setSite} />}
          {view === "export" && (
            <AdminExport
              site={site}
              menuMediodia={menuMediodia}
              menuNocturno={menuNocturno}
              institutions={institutions}
              institutionUsers={institutionUsers}
              products={products}
              institutionalMenus={institutionalMenus}
              institutionalOrders={institutionalOrders}
              productionStatuses={productionStatuses}
              setSite={setSite}
              setMenuMediodia={setMenuMediodia}
              setMenuNocturno={setMenuNocturno}
              setInstitutions={setInstitutions}
              setInstitutionUsers={setInstitutionUsers}
              setProducts={setProducts}
              setInstitutionalMenus={setInstitutionalMenus}
              setInstitutionalOrders={setInstitutionalOrders}
              setProductionStatuses={setProductionStatuses}
              onResetDemo={resetDemoData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AdminNavButton = ({
  label,
  view,
  currentView,
  onClick,
}: {
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}) => (
  <button
    type="button"
    onClick={() => onClick(view)}
    className={`rounded-full px-3 py-2 text-left ${
      currentView === view ? "bg-primary text-white" : "text-primary"
    }`}
  >
    {label}
  </button>
);
