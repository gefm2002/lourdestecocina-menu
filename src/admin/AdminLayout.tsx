import { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminMenuEditor } from "./AdminMenuEditor";
import { AdminSiteEditor } from "./AdminSiteEditor";
import { AdminExport } from "./AdminExport";
import { useData } from "../utils/data";
import { readStorage, removeStorage } from "../utils/storage";

const AUTH_KEY = "manducar:admin:auth";

type View = "mediodia" | "nocturno" | "site" | "export";

export const AdminLayout = () => {
  const { site, setSite, menuMediodia, setMenuMediodia, menuNocturno, setMenuNocturno } =
    useData();
  const [isAuth, setIsAuth] = useState(() => readStorage(AUTH_KEY, false));
  const [view, setView] = useState<View>("mediodia");

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-secondary px-4 py-10">
        <AdminLogin onSuccess={() => setIsAuth(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="rounded-ui border border-black/10 bg-white p-4">
          <p className="text-sm font-semibold text-primary">Admin Manducar</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm">
            <button
              type="button"
              onClick={() => setView("mediodia")}
              className={`rounded-full px-3 py-2 text-left ${
                view === "mediodia" ? "bg-primary text-white" : "text-primary"
              }`}
            >
              Medio día
            </button>
            <button
              type="button"
              onClick={() => setView("nocturno")}
              className={`rounded-full px-3 py-2 text-left ${
                view === "nocturno" ? "bg-primary text-white" : "text-primary"
              }`}
            >
              Nocturno
            </button>
            <button
              type="button"
              onClick={() => setView("site")}
              className={`rounded-full px-3 py-2 text-left ${
                view === "site" ? "bg-primary text-white" : "text-primary"
              }`}
            >
              Sitio
            </button>
            <button
              type="button"
              onClick={() => setView("export")}
              className={`rounded-full px-3 py-2 text-left ${
                view === "export" ? "bg-primary text-white" : "text-primary"
              }`}
            >
              Exportar
            </button>
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
              setSite={setSite}
              setMenuMediodia={setMenuMediodia}
              setMenuNocturno={setMenuNocturno}
            />
          )}
        </div>
      </div>
    </div>
  );
};
