import { useMemo, useState } from "react";
import type { MenuCategory, MenuData, MenuItem } from "../types";
import { Modal } from "../components/Modal";

type AdminMenuEditorProps = {
  title: string;
  menu: MenuData;
  setMenu: (value: MenuData) => void;
};

type ModalState =
  | { type: "category"; mode: "add" | "edit"; category?: MenuCategory }
  | { type: "item"; mode: "add" | "edit"; categoryId: string; item?: MenuItem }
  | null;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const sortByOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

export const AdminMenuEditor = ({ title, menu, setMenu }: AdminMenuEditorProps) => {
  const [modal, setModal] = useState<ModalState>(null);
  const categories = useMemo(() => sortByOrder(menu.categories), [menu.categories]);

  const updateCategory = (categoryId: string, updater: (category: MenuCategory) => MenuCategory) => {
    setMenu({
      ...menu,
      categories: menu.categories.map((category) =>
        category.id === categoryId ? updater(category) : category
      ),
    });
  };

  const removeCategory = (categoryId: string) => {
    setMenu({
      ...menu,
      categories: menu.categories.filter((category) => category.id !== categoryId),
    });
  };

  const moveCategory = (categoryId: string, direction: "up" | "down") => {
    const sorted = sortByOrder(menu.categories);
    const index = sorted.findIndex((category) => category.id === categoryId);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) return;
    const swapped = sorted.map((category, idx) => {
      if (idx === index) return { ...category, order: sorted[targetIndex].order };
      if (idx === targetIndex) return { ...category, order: sorted[index].order };
      return category;
    });
    setMenu({ ...menu, categories: swapped });
  };

  const moveItem = (categoryId: string, itemId: string, direction: "up" | "down") => {
    const category = menu.categories.find((item) => item.id === categoryId);
    if (!category) return;
    const sorted = sortByOrder(category.items);
    const index = sorted.findIndex((item) => item.id === itemId);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) return;
    const swapped = sorted.map((item, idx) => {
      if (idx === index) return { ...item, order: sorted[targetIndex].order };
      if (idx === targetIndex) return { ...item, order: sorted[index].order };
      return item;
    });
    updateCategory(categoryId, (prev) => ({ ...prev, items: swapped }));
  };

  const handleSaveCategory = (category: MenuCategory, mode: "add" | "edit") => {
    if (mode === "add") {
      setMenu({
        ...menu,
        categories: [...menu.categories, category],
      });
    } else {
      updateCategory(category.id, () => category);
    }
    setModal(null);
  };

  const handleSaveItem = (categoryId: string, item: MenuItem, mode: "add" | "edit") => {
    updateCategory(categoryId, (prev) => {
      const items = mode === "add" ? [...prev.items, item] : prev.items.map((i) => (i.id === item.id ? item : i));
      return { ...prev, items };
    });
    setModal(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-primary">{title}</h2>
          <p className="text-sm text-muted">Editá categorías, items y precios.</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() =>
            setModal({
              type: "category",
              mode: "add",
            })
          }
        >
          Agregar categoría
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-ui border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">{category.name}</p>
                <p className="text-xs text-muted">ID: {category.id}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  className="rounded-full border border-black/10 px-3 py-1"
                  onClick={() => moveCategory(category.id, "up")}
                >
                  Subir
                </button>
                <button
                  type="button"
                  className="rounded-full border border-black/10 px-3 py-1"
                  onClick={() => moveCategory(category.id, "down")}
                >
                  Bajar
                </button>
                <button
                  type="button"
                  className="rounded-full border border-black/10 px-3 py-1"
                  onClick={() => updateCategory(category.id, (prev) => ({ ...prev, isActive: !prev.isActive }))}
                >
                  {category.isActive ? "Desactivar" : "Activar"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-black/10 px-3 py-1"
                  onClick={() => setModal({ type: "category", mode: "edit", category })}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded-full border border-accent px-3 py-1 text-accent"
                  onClick={() => removeCategory(category.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary">Items</p>
                <button
                  type="button"
                  className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary"
                  onClick={() =>
                    setModal({
                      type: "item",
                      mode: "add",
                      categoryId: category.id,
                    })
                  }
                >
                  Agregar item
                </button>
              </div>
              <div className="space-y-2">
                {sortByOrder(category.items).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-black/10 px-3 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-primary">{item.name}</p>
                        <p className="text-xs text-muted">
                          ${item.price ?? "Consultar"} · Tags: {item.tags.join(", ") || "—"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <button
                          type="button"
                          className="rounded-full border border-black/10 px-3 py-1"
                          onClick={() => moveItem(category.id, item.id, "up")}
                        >
                          Subir
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-black/10 px-3 py-1"
                          onClick={() => moveItem(category.id, item.id, "down")}
                        >
                          Bajar
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-black/10 px-3 py-1"
                          onClick={() =>
                            updateCategory(category.id, (prev) => ({
                              ...prev,
                              items: prev.items.map((i) =>
                                i.id === item.id ? { ...i, isActive: !i.isActive } : i
                              ),
                            }))
                          }
                        >
                          {item.isActive ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-black/10 px-3 py-1"
                          onClick={() =>
                            setModal({ type: "item", mode: "edit", categoryId: category.id, item })
                          }
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-accent px-3 py-1 text-accent"
                          onClick={() =>
                            updateCategory(category.id, (prev) => ({
                              ...prev,
                              items: prev.items.filter((i) => i.id !== item.id),
                            }))
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {category.items.length === 0 && (
                  <p className="text-xs text-muted">No hay items en esta categoría.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={modal?.type === "category" ? "Categoría" : "Item"}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      >
        {modal?.type === "category" && (
          <CategoryForm
            mode={modal.mode}
            category={modal.category}
            onSave={handleSaveCategory}
          />
        )}
        {modal?.type === "item" && (
          <ItemForm
            mode={modal.mode}
            categoryId={modal.categoryId}
            item={modal.item}
            onSave={handleSaveItem}
          />
        )}
      </Modal>
    </section>
  );
};

const CategoryForm = ({
  mode,
  category,
  onSave,
}: {
  mode: "add" | "edit";
  category?: MenuCategory;
  onSave: (category: MenuCategory, mode: "add" | "edit") => void;
}) => {
  const [name, setName] = useState(category?.name ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [order, setOrder] = useState(category?.order ?? 1);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const id = category?.id ?? slugify(name);
        onSave(
          {
            id,
            name,
            order: Number(order),
            isActive,
            items: category?.items ?? [],
          },
          mode
        );
      }}
    >
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Nombre de la categoría"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        type="number"
        placeholder="Orden"
        value={order}
        onChange={(event) => setOrder(Number(event.target.value))}
      />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Activa
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
      >
        Guardar
      </button>
    </form>
  );
};

const ItemForm = ({
  mode,
  categoryId,
  item,
  onSave,
}: {
  mode: "add" | "edit";
  categoryId: string;
  item?: MenuItem;
  onSave: (categoryId: string, item: MenuItem, mode: "add" | "edit") => void;
}) => {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price ?? 0);
  const [consult, setConsult] = useState(item?.price === null);
  const [tags, setTags] = useState(item?.tags.join(", ") ?? "");
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [order, setOrder] = useState(item?.order ?? 1);
  const [image, setImage] = useState(item?.image ?? "");

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const id = item?.id ?? slugify(name);
        onSave(
          categoryId,
          {
            id,
            name,
            description,
            price: consult ? null : Number(price),
            isActive,
            order: Number(order),
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            image: image.trim() || undefined,
          },
          mode
        );
      }}
    >
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Nombre del item"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Descripción corta"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          placeholder="URL de imagen (opcional)"
          value={image}
          onChange={(event) => setImage(event.target.value)}
        />
        <label className="flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-muted">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleImageUpload(event.target.files?.[0] ?? null)}
          />
          Subir imagen
        </label>
      </div>
      {image && (
        <div className="rounded-2xl border border-black/10 bg-white p-3">
          <img src={image} alt={name || "Preview"} className="h-24 w-24 rounded-xl object-cover" />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          disabled={consult}
        />
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          placeholder="Tags (veggie, recomendado)"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          type="number"
          placeholder="Orden"
          value={order}
          onChange={(event) => setOrder(Number(event.target.value))}
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={consult}
            onChange={(event) => setConsult(event.target.checked)}
          />
          Precio a consultar
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Activo
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
      >
        Guardar
      </button>
    </form>
  );
};
