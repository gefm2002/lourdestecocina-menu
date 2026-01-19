import { useState } from "react";
import { Outlet } from "react-router-dom";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { HeaderSticky } from "../components/HeaderSticky";
import { MobileMenuDrawer } from "../components/MobileMenuDrawer";
import { WhatsAppFloatButton } from "../components/WhatsAppFloatButton";
import { useData } from "../utils/data";

export const MainLayout = () => {
  const { site } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary text-text">
      <HeaderSticky
        site={site}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <MobileMenuDrawer site={site} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartDrawer site={site} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Outlet />
      <Footer site={site} />
      <WhatsAppFloatButton site={site} />
    </div>
  );
};
