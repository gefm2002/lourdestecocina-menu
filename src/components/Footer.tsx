import type { SiteData } from "../types";

type FooterProps = {
  site: SiteData;
};

export const Footer = ({ site }: FooterProps) => {
  return (
    <footer className="border-t border-black/10 bg-secondary">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-primary">{site.brand.name}</p>
            <p className="text-sm text-muted">{site.brand.tagline}</p>
            <a href={`https://www.instagram.com/${site.brand.igHandle}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-muted hover:underline">Instagram @{site.brand.igHandle}</a>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Contacto</p>
            <p className="text-sm text-muted">WhatsApp: {site.contact.whatsappDisplay}</p>
            <p className="text-sm text-muted">Tel: {site.contact.phoneDisplay}</p>
            <p className="text-sm text-muted">{site.contact.address}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Horarios</p>
            {site.hours.map((hour) => (
              <p key={hour.days} className="text-sm text-muted">
                {hour.days} {hour.time}
              </p>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted">
          Diseño y desarrollo por{" "}
          <a
            href="https://structura.com.ar/"
            target="_blank"
            rel="noopener"
            className="text-muted hover:underline"
            style={{ fontSize: "0.75rem" }}
          >
            Structura
          </a>
        </div>
      </div>
    </footer>
  );
};
