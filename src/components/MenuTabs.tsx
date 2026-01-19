import { NavLink } from "react-router-dom";

export const MenuTabs = () => {
  const baseClass =
    "rounded-full px-4 py-2 text-sm font-semibold transition border border-transparent";

  return (
    <div className="flex flex-wrap gap-3">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "bg-primary text-white" : "border-black/10 text-primary"}`
        }
      >
        Menú medio día
      </NavLink>
      <NavLink
        to="/nocturno"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "bg-primary text-white" : "border-black/10 text-primary"}`
        }
      >
        Carta nocturna
      </NavLink>
    </div>
  );
};
