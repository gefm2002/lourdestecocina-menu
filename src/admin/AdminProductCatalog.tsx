import { useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import type { Product, ProductType } from "../types";
import { PRODUCT_TYPE_LABELS, slugify } from "../utils/institutional";

type AdminProductCatalogProps = {
  products: Product[];
  saveProduct: (product: Product) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

type ModalState =
  | {
      mode: "add" | "edit";
      product?: Product;
    }
  | null;

export const AdminProductCatalog = ({
  products,
  saveProduct,
  setProducts,
}: AdminProductCatalogProps) => {
  const [modal, setModal] = useState<ModalState>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProductType | "all">("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...products]
      .filter((product) => (typeFilter === "all" ? true : product.type === typeFilter))
      .filter((product) =>
        normalizedQuery
          ? `${product.name} ${product.description}`.toLowerCase().includes(normalizedQuery)
          : true
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, query, typeFilter]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Catálogo de productos</h2>
          <p className="text-sm text-muted">
            Productos reutilizables para el menú institucional o el alta rápida.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setModal({ mode: "add" })}
        >
          Nuevo producto
        </button>
      </div>

      <div className="grid gap-3 rounded-ui border border-black/10 bg-white p-4 lg:grid-cols-[1fr_auto]">
        <input
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          placeholder="Buscar por nombre o descripción"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as ProductType | "all")}
        >
          <option value="all">Todos los tipos</option>
          {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-ui border border-black/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">{product.name}</p>
                <p className="text-xs text-muted">{product.description || "Sin descripción"}</p>
              </div>
              <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted">
                {PRODUCT_TYPE_LABELS[product.type]}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted">
              Precio público {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
              }).format(product.publicPrice)}
            </p>
            <p className="text-xs text-muted">Unidad: {product.unit}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1"
                onClick={() => saveProduct({ ...product, isActive: !product.isActive })}
              >
                {product.isActive ? "Desactivar" : "Activar"}
              </button>
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1"
                onClick={() => setModal({ mode: "edit", product })}
              >
                Editar
              </button>
              <button
                type="button"
                className="rounded-full border border-accent px-3 py-1 text-accent"
                onClick={() => setProducts((prev) => prev.filter((item) => item.id !== product.id))}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={modal?.mode === "add" ? "Nuevo producto" : "Editar producto"}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      >
        {modal && (
          <ProductForm
            mode={modal.mode}
            product={modal.product}
            onSave={(product) => {
              saveProduct(product);
              setModal(null);
            }}
          />
        )}
      </Modal>
    </section>
  );
};

const ProductForm = ({
  product,
  mode,
  onSave,
}: {
  product?: Product;
  mode: "add" | "edit";
  onSave: (product: Product) => void;
}) => {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [type, setType] = useState<ProductType>(product?.type ?? "plato");
  const [publicPrice, setPublicPrice] = useState(product?.publicPrice ?? 0);
  const [unit, setUnit] = useState(product?.unit ?? "porción");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          id: product?.id ?? slugify(name),
          name: name.trim(),
          description: description.trim(),
          type,
          publicPrice: Number(publicPrice),
          unit: unit.trim(),
          isActive,
        });
      }}
    >
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Nombre del producto"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Descripción"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="grid gap-3 md:grid-cols-2">
        <select
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          value={type}
          onChange={(event) => setType(event.target.value as ProductType)}
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
          min="0"
          placeholder="Precio público"
          value={publicPrice}
          onChange={(event) => setPublicPrice(Number(event.target.value))}
          required
        />
      </div>
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Unidad"
        value={unit}
        onChange={(event) => setUnit(event.target.value)}
      />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Producto activo
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
      >
        {mode === "add" ? "Crear producto" : "Guardar cambios"}
      </button>
    </form>
  );
};
