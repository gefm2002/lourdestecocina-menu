import { useMemo, useState } from "react";
import { useCart } from "../cart/useCart";
import type { SiteData } from "../types";
import { formatPrice } from "../utils/format";
import { buildCartMessage, buildWhatsAppLink } from "../utils/whatsapp";

type CartDrawerProps = {
  site: SiteData;
  isOpen: boolean;
  onClose: () => void;
};

const initialCustomer = {
  name: "",
  phone: "",
  address: "",
  deliveryMethod: "retiro" as "retiro" | "envio",
  notes: "",
};

export const CartDrawer = ({ site, isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQty, removeItem, updateNotes, total, clear } = useCart();
  const [customer, setCustomer] = useState(initialCustomer);

  const isValid = customer.name.trim().length > 0 && customer.phone.trim().length > 0;

  const whatsappLink = useMemo(() => {
    const message = buildCartMessage(items, total, {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      deliveryMethod: customer.deliveryMethod,
      notes: customer.notes,
    });
    return buildWhatsAppLink(site.contact.whatsapp, message);
  }, [customer, items, site.contact.whatsapp, total]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm p-0 lg:items-center lg:justify-center lg:p-6">
      <div className="h-full w-full bg-white/95 p-6 shadow-soft lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:rounded-ui lg:border lg:border-black/10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary">Tu carrito</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-primary/30 bg-white px-3 py-1 text-sm text-primary shadow-sm"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 space-y-4 overflow-y-auto lg:max-h-[50vh]">
          {items.length === 0 && (
            <p className="text-sm text-muted">Todavía no agregaste productos.</p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-ui border border-black/10 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-soft/60">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{item.name}</p>
                    {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                    <p className="text-xs text-muted">
                      Subtotal: {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-accent underline-offset-4 hover:underline"
                  onClick={() => removeItem(item.id)}
                >
                  Quitar
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="h-8 w-8 rounded-full border border-primary/30 bg-white text-primary shadow-sm"
                  onClick={() => updateQty(item.id, item.qty - 1)}
                >
                  -
                </button>
                <span className="min-w-[24px] text-center text-sm">{item.qty}</span>
                <button
                  type="button"
                  className="h-8 w-8 rounded-full border border-primary/30 bg-white text-primary shadow-sm"
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >
                  +
                </button>
                <input
                  className="ml-auto w-full rounded-full border border-black/10 bg-soft/60 px-3 py-1 text-xs"
                  placeholder="Aclaraciones"
                  value={item.notes ?? ""}
                  onChange={(event) => updateNotes(item.id, event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-ui border border-black/10 bg-soft/60 p-4">
          <div className="flex items-center justify-between text-sm font-semibold text-primary">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-ui border border-black/10 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-primary">Tus datos</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-full border border-black/10 bg-soft/60 px-4 py-2 text-sm"
              placeholder="Nombre y apellido"
              value={customer.name}
              onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
            />
            <input
              className="rounded-full border border-black/10 bg-soft/60 px-4 py-2 text-sm"
              placeholder="Teléfono"
              value={customer.phone}
              onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <select
              className="rounded-full border border-black/10 bg-soft/60 px-4 py-2 text-sm"
              value={customer.deliveryMethod}
              onChange={(event) =>
                setCustomer((prev) => ({
                  ...prev,
                  deliveryMethod: event.target.value as "retiro" | "envio",
                }))
              }
            >
              <option value="retiro">Retiro</option>
              <option value="envio">Consultar envío</option>
            </select>
            <input
              className="rounded-full border border-black/10 bg-soft/60 px-4 py-2 text-sm"
              placeholder="Dirección (si pedís envío)"
              value={customer.address}
              onChange={(event) => setCustomer((prev) => ({ ...prev, address: event.target.value }))}
              disabled={customer.deliveryMethod !== "envio"}
            />
          </div>
          <textarea
            className="min-h-[80px] w-full rounded-2xl border border-black/10 bg-soft/60 px-4 py-3 text-sm"
            placeholder="Observaciones generales"
            value={customer.notes}
            onChange={(event) => setCustomer((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            className="rounded-full border border-primary/30 bg-white px-4 py-2 text-sm text-primary shadow-sm"
            onClick={() => {
              clear();
              setCustomer(initialCustomer);
            }}
          >
            Vaciar carrito
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener"
            className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white ${
              isValid && items.length > 0 ? "bg-accent shadow-sm" : "bg-muted/40 pointer-events-none"
            }`}
          >
            Enviar pedido por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
