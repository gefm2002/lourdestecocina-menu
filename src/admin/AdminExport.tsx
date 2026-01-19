import { useState } from "react";
import type { MenuData, SiteData } from "../types";

type AdminExportProps = {
  site: SiteData;
  menuMediodia: MenuData;
  menuNocturno: MenuData;
  setSite: (value: SiteData) => void;
  setMenuMediodia: (value: MenuData) => void;
  setMenuNocturno: (value: MenuData) => void;
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
  setSite,
  setMenuMediodia,
  setMenuNocturno,
}: AdminExportProps) => {
  const [payload, setPayload] = useState("");
  const [target, setTarget] = useState<"site" | "mediodia" | "nocturno">("mediodia");
  const [error, setError] = useState("");

  const handleImport = () => {
    setError("");
    try {
      const parsed = JSON.parse(payload);
      if (target === "site") {
        setSite(parsed);
      } else if (target === "mediodia") {
        setMenuMediodia(parsed);
      } else {
        setMenuNocturno(parsed);
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
        <p className="text-sm text-muted">Descargá o subí los datos del sitio.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          onClick={() => downloadJson("site.json", site)}
        >
          Exportar sitio
        </button>
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          onClick={() => downloadJson("menu.mediadia.json", menuMediodia)}
        >
          Exportar medio día
        </button>
        <button
          type="button"
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          onClick={() => downloadJson("menu.nocturno.json", menuNocturno)}
        >
          Exportar nocturno
        </button>
      </div>

      <div className="rounded-ui border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-primary">Importar JSON</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              target === "mediodia" ? "bg-primary text-white" : "border border-black/10"
            }`}
            onClick={() => setTarget("mediodia")}
          >
            Medio día
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              target === "nocturno" ? "bg-primary text-white" : "border border-black/10"
            }`}
            onClick={() => setTarget("nocturno")}
          >
            Nocturno
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              target === "site" ? "bg-primary text-white" : "border border-black/10"
            }`}
            onClick={() => setTarget("site")}
          >
            Sitio
          </button>
        </div>
        <textarea
          className="mt-3 min-h-[140px] w-full rounded-2xl border border-black/10 px-3 py-2 text-sm"
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
