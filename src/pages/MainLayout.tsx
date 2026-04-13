import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { HeaderSticky } from "../components/HeaderSticky";
import { MobileMenuDrawer } from "../components/MobileMenuDrawer";
import { WhatsAppFloatButton } from "../components/WhatsAppFloatButton";
import { useData } from "../utils/data";

export const MainLayout = () => {
  const location = useLocation();
  const { site, currentPortalUser } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isInstitutionalRoute = location.pathname.startsWith("/institucional");

  return (
    <div className="min-h-screen bg-secondary text-text">
      <HeaderSticky
        site={site}
        currentUserName={
          currentPortalUser ? `${currentPortalUser.firstName} ${currentPortalUser.lastName}` : undefined
        }
        isInstitutionalRoute={isInstitutionalRoute}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <MobileMenuDrawer
        site={site}
        currentUserName={
          currentPortalUser ? `${currentPortalUser.firstName} ${currentPortalUser.lastName}` : undefined
        }
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      {!isInstitutionalRoute && (
        <CartDrawer site={site} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
      <Outlet />
      <Footer site={site} />
      <WhatsAppFloatButton site={site} />
    </div>
  );
};
