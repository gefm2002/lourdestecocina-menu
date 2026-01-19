import { useState } from "react";
import { formatPrice } from "../utils/format";
import type { MenuItem } from "../types";

type MenuItemRowProps = {
  item: MenuItem;
  categoryName: string;
  imageSrc: string;
  onAdd: (qty: number) => void;
  onConsult: () => void;
};

export const MenuItemRow = ({
  item,
  categoryName,
  imageSrc,
  onAdd,
  onConsult,
}: MenuItemRowProps) => {
  const hasPrice = item.price !== null;
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-4 rounded-ui border border-black/10 bg-white p-4 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center">
      <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-black/5 sm:h-24 sm:w-28">
        <img src={imageSrc} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-primary">{item.name}</p>
            {item.description && <p className="text-sm text-muted">{item.description}</p>}
          </div>
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
            {categoryName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {item.tags.includes("recomendado") && (
            <span className="rounded-full border border-accent/30 px-2 py-0.5 text-xs font-semibold text-accent">
              Lo más pedido
            </span>
          )}
          {item.tags.includes("veggie") && (
            <span className="rounded-full border border-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
              Veggie
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            {hasPrice ? `Precio único: ${formatPrice(item.price)}` : "Consultar precio"}
          </div>
          {hasPrice ? (
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1 text-sm">
                <button
                  type="button"
                  className="h-6 w-6 rounded-full border border-black/10"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="min-w-[16px] text-center text-sm">{qty}</span>
                <button
                  type="button"
                  className="h-6 w-6 rounded-full border border-black/10"
                  onClick={() => setQty((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAdd(qty);
                  setQty(1);
                }}
                className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm"
              >
                Agregar
              </button>
              <span className="text-sm font-semibold text-primary">
                {formatPrice(item.price * qty)}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onConsult}
              className="ml-auto rounded-full border border-primary/40 bg-white px-4 py-2 text-xs font-semibold text-primary"
            >
              Preguntar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
