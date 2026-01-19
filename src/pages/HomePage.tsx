import { useMemo, useState } from "react";
import { useCart } from "../cart/useCart";
import { CategorySection } from "../components/CategorySection";
import { FaqAccordion } from "../components/FaqAccordion";
import { MapEmbed } from "../components/MapEmbed";
import { MenuTabs } from "../components/MenuTabs";
import { Testimonials } from "../components/Testimonials";
import { useData } from "../utils/data";
import { filterMenu, flattenMenuItems } from "../utils/menu";

type HomePageProps = {
  menuType: "mediodia" | "nocturno";
};

export const HomePage = ({ menuType }: HomePageProps) => {
  const { site, menuMediodia, menuNocturno } = useData();
  const { addItem } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [filters, setFilters] = useState<string[]>([]);

  const menuData = menuType === "mediodia" ? menuMediodia : menuNocturno;
  const categories = menuData.categories.filter((item) => item.isActive);
  const filteredCategories = useMemo(
    () => filterMenu(menuData, search, category, filters),
    [category, filters, menuData, search]
  );
  const allItems = useMemo(() => flattenMenuItems(menuData), [menuData]);
  const itemsById = useMemo(() => new Map(allItems.map((item) => [item.id, item])), [allItems]);

  const destacados = allItems.filter((item) => item.tags.includes("recomendado")).slice(0, 3);

  const toggleFilter = (tag: string) => {
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleAddItem = (itemId: string) => {
    const item = itemsById.get(itemId);
    if (!item || item.price === null) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
    });
  };

  const handleConsult = (itemName: string) => {
    const message = `Hola Manducar, quería consultar por ${itemName}. ¿Me pasás disponibilidad de hoy?`;
    const url = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const whatsappHref = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    "Hola Manducar, quiero hacer un pedido. ¿Me pasás disponibilidad de hoy?"
  )}`;

  return (
    <main className="space-y-20 pb-20">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              {site.brand.name} | {site.brand.tagline}
            </p>
            <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
              Comidas caseras en Caballito
            </h1>
            <p className="text-base text-muted">
              Elegí del menú y mandá tu pedido por WhatsApp. Retiro o consulta de envío.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-primary">
                {site.contact.address}
              </span>
              {site.hours.map((hour) => (
                <span
                  key={hour.days}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs text-primary"
                >
                  {hour.days} {hour.time}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${site.contact.whatsapp}`}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
              >
                Pedir por WhatsApp
              </a>
              <a
                href="#menu"
                className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary"
              >
                Ver menú
              </a>
            </div>
            <p className="text-sm text-muted">
              WhatsApp {site.contact.whatsappDisplay} · Tel {site.contact.phoneDisplay}
            </p>
          </div>
          <div className="relative">
            <img
              src="/images/hero.svg"
              alt="Comidas caseras Manducar"
              className="w-full rounded-ui border border-black/10"
            />
          </div>
        </div>
      </section>

      <section id="destacado" className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold text-primary">Lo más pedido</h2>
            <p className="text-sm text-muted">Lo que más eligen nuestros vecinos.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {destacados.map((item, index) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-ui border border-black/10 bg-white"
              >
                <img
                  src={`/images/most-${index + 1}.svg`}
                  alt={item.name}
                  className="h-40 w-full object-cover"
                />
                <div className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-primary">{item.name}</p>
                  <button
                    type="button"
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
                    onClick={() => handleAddItem(item.id)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <a
            href={whatsappHref}
            className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            Hacer pedido
          </a>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl space-y-8 px-4 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-primary">Menú completo</h2>
            <p className="text-sm text-muted">
              Elegí medio día o nocturno y armá tu pedido.
            </p>
          </div>
          <MenuTabs />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <input
            className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
            placeholder="Buscar por nombre o ingrediente"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleFilter("veggie")}
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                filters.includes("veggie")
                  ? "bg-primary text-white"
                  : "border border-black/10 text-primary"
              }`}
            >
              Veggie
            </button>
            <button
              type="button"
              onClick={() => toggleFilter("recomendado")}
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                filters.includes("recomendado")
                  ? "bg-primary text-white"
                  : "border border-black/10 text-primary"
              }`}
            >
              Lo más pedido
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {filteredCategories.map((categoryItem) => (
            <CategorySection
              key={categoryItem.id}
              category={categoryItem}
              onAddItem={handleAddItem}
              onConsultItem={handleConsult}
            />
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-sm text-muted">No encontramos resultados con esos filtros.</p>
          )}
        </div>
        <a
          href={whatsappHref}
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Hacer pedido
        </a>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold text-primary">Galería</h2>
          <p className="text-sm text-muted">Algunas de nuestras opciones caseras.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <img
              key={index}
              src={`/images/gallery-${index}.svg`}
              alt={`Galería Manducar ${index}`}
              className="h-44 w-full rounded-ui border border-black/10 object-cover"
            />
          ))}
        </div>
        <a
          href={whatsappHref}
          className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
        >
          Hacer pedido
        </a>
      </section>

      <section className="mx-auto max-w-6xl px-4 lg:px-8">
        <Testimonials />
        <div className="mt-6">
          <a
            href={whatsappHref}
            className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            Hacer pedido
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 lg:px-8">
        <FaqAccordion />
        <div className="mt-6">
          <a
            href={whatsappHref}
            className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            Hacer pedido
          </a>
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-6xl space-y-6 px-4 lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold text-primary">Dónde estamos</h2>
          <p className="text-sm text-muted">Vení a retirar o consultanos por envío.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <div className="rounded-ui border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold text-primary">Dirección</p>
              <p className="text-sm text-muted">{site.contact.address}</p>
            </div>
            <div className="rounded-ui border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold text-primary">Horarios</p>
              {site.hours.map((hour) => (
                <p key={hour.days} className="text-sm text-muted">
                  {hour.days} {hour.time}
                </p>
              ))}
            </div>
            <div className="rounded-ui border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold text-primary">Teléfonos</p>
              <p className="text-sm text-muted">WhatsApp: {site.contact.whatsappDisplay}</p>
              <p className="text-sm text-muted">Tel: {site.contact.phoneDisplay}</p>
            </div>
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(site.contact.mapQuery)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
            >
              Cómo llegar
            </a>
            <a
              href={whatsappHref}
              className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Hacer pedido
            </a>
          </div>
          <MapEmbed query={site.contact.mapQuery} />
        </div>
      </section>
    </main>
  );
};
