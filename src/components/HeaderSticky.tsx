import { Link, NavLink } from "react-router-dom";
import { useCart } from "../cart/useCart";
import type { SiteData } from "../types";
import { CartIcon, MenuIcon, WhatsAppIcon } from "./icons";

type HeaderStickyProps = {
  site: SiteData;
  currentUserName?: string;
  isInstitutionalRoute: boolean;
  onCartClick: () => void;
  onMenuClick: () => void;
};

export const HeaderSticky = ({
  site,
  currentUserName,
  isInstitutionalRoute,
  onCartClick,
  onMenuClick,
}: HeaderStickyProps) => {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-primary lg:hidden"
            aria-label="Abrir menú"
            onClick={onMenuClick}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white">
              <img src="/images/logo.png" alt="Lourdes te Cocina" className="h-full w-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {site.brand.name}
              </p>
              <p className="text-xs text-muted">{site.brand.tagline}</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-primary lg:flex">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-accent" : "")}>
            Menú medio día
          </NavLink>
          <NavLink
            to="/nocturno"
            className={({ isActive }) => (isActive ? "text-accent" : "")}
          >
            Carta nocturna
          </NavLink>
          <NavLink
            to="/institucional"
            className={({ isActive }) =>
              `${isInstitutionalRoute || isActive ? "text-accent" : ""} ${currentUserName ? "font-semibold" : ""}`
            }
          >
            {currentUserName ? `Hola, ${currentUserName.split(" ")[0]}` : "Viandas y grupos"}
          </NavLink>
          <a href="#menu">Menú completo</a>
          <a href="#contacto">Contacto</a>
          <Link to="/admin" className="text-muted">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 lg:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          {!isInstitutionalRoute && (
            <button
              type="button"
              onClick={onCartClick}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-primary shadow-sm"
              aria-label="Abrir carrito"
            >
              <CartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
