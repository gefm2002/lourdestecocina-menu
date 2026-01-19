import type { SiteData } from "../types";

type WhatsAppFloatButtonProps = {
  site: SiteData;
};

export const WhatsAppFloatButton = ({ site }: WhatsAppFloatButtonProps) => (
  <a
    href={`https://wa.me/${site.contact.whatsapp}?text=Hola%20Manducar%2C%20quiero%20hacer%20un%20pedido.%20%C2%BFMe%20pas%C3%A1s%20disponibilidad%20de%20hoy%3F`}
    target="_blank"
    rel="noopener"
    className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-soft"
    aria-label="WhatsApp Manducar"
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.78 11.78 0 0 0 12 0C5.38 0 0 5.38 0 12c0 2.11.55 4.17 1.59 6.01L0 24l6.17-1.59A11.93 11.93 0 0 0 12 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.66.94.98-3.56-.24-.37A9.83 9.83 0 0 1 2 12C2 6.49 6.49 2 12 2a9.93 9.93 0 0 1 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.51-4.49 10-10 10Zm5.47-7.53c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.23-.66.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.89 1.23 3.1.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" />
    </svg>
  </a>
);
