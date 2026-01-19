import { Link, NavLink } from "react-router-dom";
import { useCart } from "../cart/useCart";
import type { SiteData } from "../types";

type HeaderStickyProps = {
  site: SiteData;
  onCartClick: () => void;
  onMenuClick: () => void;
};

export const HeaderSticky = ({ site, onCartClick, onMenuClick }: HeaderStickyProps) => {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-secondary/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full border border-black/10 lg:hidden"
            aria-label="Abrir menú"
            onClick={onMenuClick}
          >
            <span className="h-0.5 w-5 rounded-full bg-primary" />
            <span className="h-0.5 w-5 rounded-full bg-primary" />
            <span className="h-0.5 w-5 rounded-full bg-primary" />
          </button>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-primary">
              <img src="/images/logo.png" alt="Manducar" className="h-full w-full object-cover" />
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
          <a href="#menu">Menú completo</a>
          <a href="#contacto">Contacto</a>
          <a href="/admin" className="text-muted">
            Admin
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 lg:inline-flex"
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={onCartClick}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white"
            aria-label="Abrir carrito"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
