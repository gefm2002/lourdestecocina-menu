import { useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import type {
  Institution,
  InstitutionalMenu,
  InstitutionalMenuDay,
  InstitutionalMenuOption,
  InstitutionalMenuSection,
  MenuCycle,
  Product,
  ProductType,
  Weekday,
} from "../types";
import { formatPrice } from "../utils/format";
import {
  addDays,
  createId,
  formatShortDate,
  getMenuCalendar,
  MENU_CYCLE_LABELS,
  PRODUCT_TYPE_LABELS,
  slugify,
  toISODate,
  WEEKDAYS,
} from "../utils/institutional";

type AdminInstitutionalMenusProps = {
  institutions: Institution[];
  products: Product[];
  menus: InstitutionalMenu[];
  setMenus: React.Dispatch<React.SetStateAction<InstitutionalMenu[]>>;
  saveProduct: (product: Product) => void;
};

type OptionTarget = {
  weekday: Weekday;
  sectionId: string;
  itemType: ProductType;
};

const buildDefaultSection = (
  weekday: Weekday,
  name: string,
  itemType: ProductType
): InstitutionalMenuSection => ({
  id: `${weekday}-${slugify(name) || itemType}-${createId("section").slice(-4)}`,
  name,
  itemType,
  selectionLimit: 1,
  options: [],
});

const buildDefaultDay = (weekday: Weekday): InstitutionalMenuDay => ({
  weekday,
  sections: [
    buildDefaultSection(weekday, "Plato principal", "plato"),
    buildDefaultSection(weekday, "Postre", "postre"),
    buildDefaultSection(weekday, "Bebida", "bebida"),
  ],
});

const suggestEndDate = (startDate: string, cycle: MenuCycle) => {
  const base = new Date(`${startDate}T12:00:00`);
  const extraDays =
    cycle === "weekly" ? 4 : cycle === "biweekly" ? 11 : 27;
  return toISODate(addDays(base, extraDays));
};

const buildEmptyMenu = (institutionId: string): InstitutionalMenu => {
  const today = toISODate(new Date());
  const cycle: MenuCycle = "weekly";
  return {
    id: "",
    institutionId,
    name: "",
    cycle,
    startDate: today,
    endDate: suggestEndDate(today, cycle),
    isActive: true,
    createdAt: new Date().toISOString(),
    days: WEEKDAYS.map((day) => buildDefaultDay(day.value)),
  };
};

const cloneMenu = (menu: InstitutionalMenu) =>
  JSON.parse(JSON.stringify(menu)) as InstitutionalMenu;

export const AdminInstitutionalMenus = ({
  institutions,
  products,
  menus,
  setMenus,
  saveProduct,
}: AdminInstitutionalMenusProps) => {
  const activeInstitutions = institutions.filter((institution) => institution.isActive);
  const orderedMenus = useMemo(
    () =>
      [...menus].sort((a, b) =>
        `${b.startDate}-${b.name}`.localeCompare(`${a.startDate}-${a.name}`)
      ),
    [menus]
  );
  const [selectedMenuId, setSelectedMenuId] = useState<string>(orderedMenus[0]?.id ?? "new");
  const [draft, setDraft] = useState<InstitutionalMenu>(() =>
    orderedMenus[0]
      ? cloneMenu(orderedMenus[0])
      : buildEmptyMenu(activeInstitutions[0]?.id ?? institutions[0]?.id ?? "")
  );
  const [optionTarget, setOptionTarget] = useState<OptionTarget | null>(null);

  const institutionById = useMemo(
    () => new Map(institutions.map((institution) => [institution.id, institution])),
    [institutions]
  );

  const loadMenu = (menu: InstitutionalMenu) => {
    setSelectedMenuId(menu.id);
    setDraft(cloneMenu(menu));
  };

  const startNewMenu = () => {
    setSelectedMenuId("new");
    setDraft(buildEmptyMenu(activeInstitutions[0]?.id ?? institutions[0]?.id ?? ""));
  };

  const updateDay = (weekday: Weekday, updater: (day: InstitutionalMenuDay) => InstitutionalMenuDay) => {
    setDraft((prev) => ({
      ...prev,
      days: prev.days.map((day) => (day.weekday === weekday ? updater(day) : day)),
    }));
  };

  const saveDraft = (event: React.FormEvent) => {
    event.preventDefault();
    const nextId = draft.id || `${slugify(draft.name) || "menu"}-${createId("inst").slice(-4)}`;
    const nextMenu = {
      ...draft,
      id: nextId,
    };

    setMenus((prev) => {
      const exists = prev.some((menu) => menu.id === nextId);
      if (!exists) return [nextMenu, ...prev];
      return prev.map((menu) => (menu.id === nextId ? nextMenu : menu));
    });
    setSelectedMenuId(nextId);
    setDraft(cloneMenu(nextMenu));
  };

  const calendarPreview = useMemo(() => getMenuCalendar(draft), [draft]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Menús institucionales</h2>
          <p className="text-sm text-muted">
            Planificación semanal, quincenal o mensual con precios propios y opciones por día.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={startNewMenu}
        >
          Nuevo menú institucional
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4 rounded-ui border border-black/10 bg-white p-4">
          <p className="text-sm font-semibold text-primary">Menús cargados</p>
          <div className="space-y-3">
            {orderedMenus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                className={`w-full rounded-2xl border px-4 py-3 text-left ${
                  selectedMenuId === menu.id
                    ? "border-primary bg-primary text-white"
                    : "border-black/10 bg-white text-primary"
                }`}
                onClick={() => loadMenu(menu)}
              >
                <p className="text-sm font-semibold">{menu.name}</p>
                <p className={`mt-1 text-xs ${selectedMenuId === menu.id ? "text-white/80" : "text-muted"}`}>
                  {institutionById.get(menu.institutionId)?.name ?? "Sin institución"} ·{" "}
                  {MENU_CYCLE_LABELS[menu.cycle]}
                </p>
                <p className={`text-xs ${selectedMenuId === menu.id ? "text-white/80" : "text-muted"}`}>
                  {formatShortDate(menu.startDate)} al {formatShortDate(menu.endDate)}
                </p>
              </button>
            ))}
            {orderedMenus.length === 0 && (
              <p className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-sm text-muted">
                No hay menús institucionales guardados todavía.
              </p>
            )}
          </div>
        </aside>

        <form className="space-y-6" onSubmit={saveDraft}>
          <div className="rounded-ui border border-black/10 bg-white p-6">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-3">
                <input
                  className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
                  placeholder="Nombre del menú"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
                <select
                  className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
                  value={draft.institutionId}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, institutionId: event.target.value }))
                  }
                  required
                >
                  <option value="">Seleccioná una institución</option>
                  {activeInstitutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <select
                  className="rounded-full border border-black/10 px-4 py-2 text-sm"
                  value={draft.cycle}
                  onChange={(event) => {
                    const nextCycle = event.target.value as MenuCycle;
                    setDraft((prev) => ({
                      ...prev,
                      cycle: nextCycle,
                      endDate: suggestEndDate(prev.startDate, nextCycle),
                    }));
                  }}
                >
                  {Object.entries(MENU_CYCLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  className="rounded-full border border-black/10 px-4 py-2 text-sm"
                  type="date"
                  value={draft.startDate}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                      endDate: suggestEndDate(event.target.value, prev.cycle),
                    }))
                  }
                  required
                />
                <input
                  className="rounded-full border border-black/10 px-4 py-2 text-sm"
                  type="date"
                  value={draft.endDate}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, isActive: event.target.checked }))
                }
              />
              Menú habilitado
            </label>

            <div className="mt-5 rounded-2xl border border-black/10 bg-soft/40 px-4 py-3">
              <p className="text-sm font-semibold text-primary">Programación generada por fechas</p>
              <p className="text-xs text-muted">
                Se crearán {calendarPreview.length} jornadas hábiles entre {formatShortDate(draft.startDate)} y{" "}
                {formatShortDate(draft.endDate)}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {calendarPreview.slice(0, 10).map((day) => (
                  <span
                    key={day.date}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-primary"
                  >
                    {day.label} {formatShortDate(day.date)}
                  </span>
                ))}
                {calendarPreview.length > 10 && (
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-muted">
                    +{calendarPreview.length - 10} días más
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {draft.days.map((day) => (
              <div key={day.weekday} className="rounded-ui border border-black/10 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {WEEKDAYS.find((item) => item.value === day.weekday)?.label}
                    </p>
                    <p className="text-xs text-muted">
                      Cada sección debería ofrecer al menos 2 opciones para el usuario.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary"
                    onClick={() =>
                      updateDay(day.weekday, (currentDay) => ({
                        ...currentDay,
                        sections: [
                          ...currentDay.sections,
                          buildDefaultSection(day.weekday, "Nueva sección", "otro"),
                        ],
                      }))
                    }
                  >
                    Agregar sección
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {day.sections.map((section) => (
                    <div key={section.id} className="rounded-2xl border border-black/10 p-4">
                      <div className="grid gap-3 lg:grid-cols-[1fr_180px_120px_auto] lg:items-center">
                        <input
                          className="rounded-full border border-black/10 px-4 py-2 text-sm"
                          value={section.name}
                          onChange={(event) =>
                            updateDay(day.weekday, (currentDay) => ({
                              ...currentDay,
                              sections: currentDay.sections.map((item) =>
                                item.id === section.id ? { ...item, name: event.target.value } : item
                              ),
                            }))
                          }
                        />
                        <select
                          className="rounded-full border border-black/10 px-4 py-2 text-sm"
                          value={section.itemType}
                          onChange={(event) =>
                            updateDay(day.weekday, (currentDay) => ({
                              ...currentDay,
                              sections: currentDay.sections.map((item) =>
                                item.id === section.id
                                  ? { ...item, itemType: event.target.value as ProductType }
                                  : item
                              ),
                            }))
                          }
                        >
                          {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <input
                          className="rounded-full border border-black/10 px-4 py-2 text-sm"
                          type="number"
                          min="1"
                          value={section.selectionLimit}
                          onChange={(event) =>
                            updateDay(day.weekday, (currentDay) => ({
                              ...currentDay,
                              sections: currentDay.sections.map((item) =>
                                item.id === section.id
                                  ? { ...item, selectionLimit: Number(event.target.value) || 1 }
                                  : item
                              ),
                            }))
                          }
                        />
                        <button
                          type="button"
                          className="rounded-full border border-accent px-3 py-2 text-xs text-accent"
                          onClick={() =>
                            updateDay(day.weekday, (currentDay) => ({
                              ...currentDay,
                              sections: currentDay.sections.filter((item) => item.id !== section.id),
                            }))
                          }
                        >
                          Eliminar
                        </button>
                      </div>

                      {section.options.length < 2 && (
                        <p className="mt-3 text-xs text-accent">
                          Recomendación: cargá al menos 2 opciones en esta sección.
                        </p>
                      )}

                      <div className="mt-4 space-y-3">
                        {section.options.map((option) => (
                          <div
                            key={option.id}
                            className="grid gap-3 rounded-2xl border border-black/10 px-4 py-3 md:grid-cols-[1fr_120px_auto]"
                          >
                            <div>
                              <p className="text-sm font-semibold text-primary">{option.name}</p>
                              <p className="text-xs text-muted">
                                {PRODUCT_TYPE_LABELS[option.itemType]} · {option.source === "inline" ? "Alta rápida" : "Catálogo"}
                              </p>
                            </div>
                            <input
                              className="rounded-full border border-black/10 px-4 py-2 text-sm"
                              type="number"
                              min="0"
                              value={option.menuPrice}
                              onChange={(event) =>
                                updateDay(day.weekday, (currentDay) => ({
                                  ...currentDay,
                                  sections: currentDay.sections.map((item) =>
                                    item.id === section.id
                                      ? {
                                          ...item,
                                          options: item.options.map((entry) =>
                                            entry.id === option.id
                                              ? { ...entry, menuPrice: Number(event.target.value) || 0 }
                                              : entry
                                          ),
                                        }
                                      : item
                                  ),
                                }))
                              }
                            />
                            <button
                              type="button"
                              className="rounded-full border border-accent px-3 py-2 text-xs text-accent"
                              onClick={() =>
                                updateDay(day.weekday, (currentDay) => ({
                                  ...currentDay,
                                  sections: currentDay.sections.map((item) =>
                                    item.id === section.id
                                      ? {
                                          ...item,
                                          options: item.options.filter((entry) => entry.id !== option.id),
                                        }
                                      : item
                                  ),
                                }))
                              }
                            >
                              Quitar opción
                            </button>
                          </div>
                        ))}
                        {section.options.length === 0 && (
                          <p className="text-xs text-muted">
                            Esta sección todavía no tiene opciones disponibles.
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        className="mt-4 rounded-full border border-primary px-3 py-2 text-xs font-semibold text-primary"
                        onClick={() =>
                          setOptionTarget({
                            weekday: day.weekday,
                            sectionId: section.id,
                            itemType: section.itemType,
                          })
                        }
                      >
                        Agregar opción desde catálogo o alta rápida
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Guardar menú institucional
            </button>
            {selectedMenuId !== "new" && (
              <button
                type="button"
                className="rounded-full border border-accent px-5 py-3 text-sm font-semibold text-accent"
                onClick={() => {
                  setMenus((prev) => prev.filter((menu) => menu.id !== selectedMenuId));
                  startNewMenu();
                }}
              >
                Eliminar menú
              </button>
            )}
          </div>
        </form>
      </div>

      <Modal
        title="Agregar opción al menú"
        isOpen={optionTarget !== null}
        onClose={() => setOptionTarget(null)}
      >
        {optionTarget && (
          <MenuOptionForm
            itemType={optionTarget.itemType}
            products={products}
            onSave={({ option, createdProduct }) => {
              if (createdProduct) {
                saveProduct(createdProduct);
              }
              updateDay(optionTarget.weekday, (currentDay) => ({
                ...currentDay,
                sections: currentDay.sections.map((section) =>
                  section.id === optionTarget.sectionId
                    ? { ...section, options: [...section.options, option] }
                    : section
                ),
              }));
              setOptionTarget(null);
            }}
          />
        )}
      </Modal>
    </section>
  );
};

const MenuOptionForm = ({
  itemType,
  products,
  onSave,
}: {
  itemType: ProductType;
  products: Product[];
  onSave: (payload: { option: InstitutionalMenuOption; createdProduct?: Product }) => void;
}) => {
  const [mode, setMode] = useState<"catalog" | "inline">("catalog");
  const filteredProducts = products.filter((product) => product.type === itemType && product.isActive);
  const [selectedProductId, setSelectedProductId] = useState(filteredProducts[0]?.id ?? "");
  const [menuPrice, setMenuPrice] = useState(filteredProducts[0]?.publicPrice ?? 0);
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customPublicPrice, setCustomPublicPrice] = useState(0);
  const [customUnit, setCustomUnit] = useState("porción");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (mode === "catalog") {
          const product = filteredProducts.find((entry) => entry.id === selectedProductId);
          if (!product) return;
          onSave({
            option: {
              id: createId("option"),
              productId: product.id,
              name: product.name,
              description: product.description,
              itemType: product.type,
              menuPrice: Number(menuPrice),
              source: "catalog",
            },
          });
          return;
        }

        const createdProduct: Product = {
          id: `${slugify(customName) || "producto"}-${createId("prod").slice(-4)}`,
          name: customName.trim(),
          description: customDescription.trim(),
          type: itemType,
          publicPrice: Number(customPublicPrice),
          unit: customUnit.trim(),
          isActive: true,
        };

        onSave({
          createdProduct,
          option: {
            id: createId("option"),
            productId: createdProduct.id,
            name: createdProduct.name,
            description: createdProduct.description,
            itemType: createdProduct.type,
            menuPrice: Number(menuPrice),
            source: "inline",
          },
        });
      }}
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          className={`rounded-full px-3 py-2 font-semibold ${
            mode === "catalog" ? "bg-primary text-white" : "border border-black/10"
          }`}
          onClick={() => setMode("catalog")}
        >
          Usar catálogo
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-2 font-semibold ${
            mode === "inline" ? "bg-primary text-white" : "border border-black/10"
          }`}
          onClick={() => setMode("inline")}
        >
          Crear producto rápido
        </button>
      </div>

      {mode === "catalog" ? (
        <>
          <select
            className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
            value={selectedProductId}
            onChange={(event) => {
              const nextId = event.target.value;
              const product = filteredProducts.find((entry) => entry.id === nextId);
              setSelectedProductId(nextId);
              if (product) {
                setMenuPrice(product.publicPrice);
              }
            }}
            required
          >
            <option value="">Seleccioná un producto</option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} · {formatPrice(product.publicPrice)}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
            type="number"
            min="0"
            placeholder="Precio dentro del menú"
            value={menuPrice}
            onChange={(event) => setMenuPrice(Number(event.target.value))}
            required
          />
        </>
      ) : (
        <>
          <input
            className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
            placeholder="Nombre del producto"
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            required
          />
          <input
            className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
            placeholder="Descripción"
            value={customDescription}
            onChange={(event) => setCustomDescription(event.target.value)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-full border border-black/10 px-4 py-2 text-sm"
              type="number"
              min="0"
              placeholder="Precio público referencia"
              value={customPublicPrice}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setCustomPublicPrice(nextValue);
                if (menuPrice === 0) {
                  setMenuPrice(nextValue);
                }
              }}
              required
            />
            <input
              className="rounded-full border border-black/10 px-4 py-2 text-sm"
              placeholder="Unidad"
              value={customUnit}
              onChange={(event) => setCustomUnit(event.target.value)}
            />
          </div>
          <input
            className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
            type="number"
            min="0"
            placeholder="Precio dentro del menú"
            value={menuPrice}
            onChange={(event) => setMenuPrice(Number(event.target.value))}
            required
          />
        </>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
      >
        Agregar opción
      </button>
    </form>
  );
};
