import { formatPrice } from "../utils/format";
import type { MenuItem } from "../types";

type MenuItemRowProps = {
  item: MenuItem;
  onAdd: () => void;
  onConsult: () => void;
};

export const MenuItemRow = ({ item, onAdd, onConsult }: MenuItemRowProps) => {
  const hasPrice = item.price !== null;

  return (
    <div className="flex flex-col gap-2 rounded-ui border border-black/10 bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <p className="text-base font-semibold text-primary">{item.name}</p>
            <span className="mx-3 hidden flex-1 border-b border-dotted border-muted/60 sm:block" />
          </div>
          {item.description && (
            <p className="text-sm text-muted">{item.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-primary">{formatPrice(item.price)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {item.tags.includes("recomendado") && (
          <span className="rounded-full bg-soft px-2 py-0.5 text-xs font-semibold text-primary">
            Lo más pedido
          </span>
        )}
        {item.tags.includes("veggie") && (
          <span className="rounded-full bg-soft px-2 py-0.5 text-xs font-semibold text-primary">
            Veggie
          </span>
        )}
        <div className="ml-auto">
          {hasPrice ? (
            <button
              type="button"
              onClick={onAdd}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white"
            >
              Agregar
            </button>
          ) : (
            <button
              type="button"
              onClick={onConsult}
              className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary"
            >
              Preguntar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
