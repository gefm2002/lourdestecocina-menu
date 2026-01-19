import type { SiteData } from "../types";
import { WhatsAppIcon } from "./icons";

type WhatsAppFloatButtonProps = {
  site: SiteData;
};

export const WhatsAppFloatButton = ({ site }: WhatsAppFloatButtonProps) => (
  <a
    href={`https://wa.me/${site.contact.whatsapp}?text=Hola%20Manducar%2C%20quiero%20hacer%20un%20pedido.%20%C2%BFMe%20pas%C3%A1s%20disponibilidad%20de%20hoy%3F`}
    target="_blank"
    rel="noopener"
    className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-4 text-white shadow-soft transition hover:scale-[1.02]"
    aria-label="WhatsApp Manducar"
  >
    <WhatsAppIcon className="h-5 w-5" />
    <span className="hidden text-xs font-semibold uppercase tracking-wide sm:inline">
      WhatsApp
    </span>
  </a>
);
