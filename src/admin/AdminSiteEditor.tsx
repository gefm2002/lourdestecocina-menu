import { useState } from "react";
import type { SiteData } from "../types";

type AdminSiteEditorProps = {
  site: SiteData;
  setSite: (value: SiteData) => void;
};

export const AdminSiteEditor = ({ site, setSite }: AdminSiteEditorProps) => {
  const [form, setForm] = useState(site);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      ...("brand" in prev && field.startsWith("brand.")
        ? { brand: { ...prev.brand, [field.replace("brand.", "")]: value } }
        : {}),
      ...("contact" in prev && field.startsWith("contact.")
        ? { contact: { ...prev.contact, [field.replace("contact.", "")]: value } }
        : {}),
    }));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">Datos del sitio</h2>
        <p className="text-sm text-muted">Actualizá textos, horarios y contacto.</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSite(form);
        }}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.brand.name}
            onChange={(event) => handleChange("brand.name", event.target.value)}
            placeholder="Nombre de marca"
          />
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.brand.tagline}
            onChange={(event) => handleChange("brand.tagline", event.target.value)}
            placeholder="Tagline"
          />
        </div>
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          value={form.brand.igHandle}
          onChange={(event) => handleChange("brand.igHandle", event.target.value)}
          placeholder="Instagram"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.contact.whatsappDisplay}
            onChange={(event) => handleChange("contact.whatsappDisplay", event.target.value)}
            placeholder="WhatsApp (display)"
          />
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.contact.phoneDisplay}
            onChange={(event) => handleChange("contact.phoneDisplay", event.target.value)}
            placeholder="Teléfono"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.contact.whatsapp}
            onChange={(event) => handleChange("contact.whatsapp", event.target.value)}
            placeholder="WhatsApp (número)"
          />
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.contact.address}
            onChange={(event) => handleChange("contact.address", event.target.value)}
            placeholder="Dirección"
          />
        </div>
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          value={form.contact.mapQuery}
          onChange={(event) => handleChange("contact.mapQuery", event.target.value)}
          placeholder="Query del mapa"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.hours[0]?.days ?? ""}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                hours: [{ ...prev.hours[0], days: event.target.value }],
              }))
            }
            placeholder="Días"
          />
          <input
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={form.hours[0]?.time ?? ""}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                hours: [{ ...prev.hours[0], time: event.target.value }],
              }))
            }
            placeholder="Horario"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white"
        >
          Guardar cambios
        </button>
      </form>
    </section>
  );
};
