import type { CartItem } from "../types";
import { formatPrice } from "./format";

type CustomerInfo = {
  name: string;
  phone: string;
  address?: string;
  deliveryMethod: "retiro" | "envio";
  notes?: string;
};

export const buildWhatsAppLink = (phone: string, message: string) => {
  const url = new URL(`https://wa.me/${phone}`);
  url.searchParams.set("text", message);
  return url.toString();
};

export const buildCartMessage = (items: CartItem[], total: number, info: CustomerInfo) => {
  const lines = [
    "Hola Manducar, quiero hacer un pedido.",
    "",
    "Detalle:",
    ...items.map((item) => {
      const variant = item.variant ? ` (${item.variant})` : "";
      const subtotal = item.price * item.qty;
      const note = item.notes ? ` | Aclaraciones: ${item.notes}` : "";
      return `- ${item.qty} x ${item.name}${variant} - ${formatPrice(subtotal)}${note}`;
    }),
    "",
    `Total: ${formatPrice(total)}`,
    "",
    `Nombre: ${info.name}`,
    `Teléfono: ${info.phone}`,
    `Método: ${info.deliveryMethod === "retiro" ? "Retiro" : "Consultar envío"}`,
  ];

  if (info.address && info.deliveryMethod === "envio") {
    lines.push(`Dirección: ${info.address}`);
  }

  if (info.notes) {
    lines.push(`Observaciones: ${info.notes}`);
  }

  return lines.join("\n");
};
