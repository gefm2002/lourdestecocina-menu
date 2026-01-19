import { Link } from "react-router-dom";
import type { SiteData } from "../types";

type MobileMenuDrawerProps = {
  site: SiteData;
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenuDrawer = ({ site, isOpen, onClose }: MobileMenuDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
      <div className="absolute left-0 top-0 h-full w-72 bg-secondary p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-black/10 bg-primary">
              <img src="/images/logo.png" alt="Manducar" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{site.brand.name}</p>
              <p className="text-xs text-muted">{site.brand.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 px-3 py-1 text-sm"
          >
            Cerrar
          </button>
        </div>

        <nav className="flex flex-col gap-4 text-base text-primary">
          <Link to="/" onClick={onClose}>
            Menú medio día
          </Link>
          <Link to="/nocturno" onClick={onClose}>
            Carta nocturna
          </Link>
          <a href="#menu" onClick={onClose}>
            Menú completo
          </a>
          <a href="#destacado" onClick={onClose}>
            Lo más pedido
          </a>
          <a href="#contacto" onClick={onClose}>
            Contacto
          </a>
          <Link to="/admin" onClick={onClose} className="text-muted">
            Admin
          </Link>
        </nav>

        <div className="mt-8">
          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Cerrar" />
    </div>
  );
};
