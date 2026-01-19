import type { MenuCategory } from "../types";
import { MenuItemRow } from "./MenuItemRow";

type CategorySectionProps = {
  category: MenuCategory;
  onAddItem: (itemId: string, qty: number, imageSrc: string) => void;
  onConsultItem: (itemName: string) => void;
};

const categoryImages: Record<string, string> = {
  entradas: "/images/stock-2.jpg",
  "platos-dia": "/images/stock-3.jpg",
  principales: "/images/stock-4.jpg",
  guarniciones: "/images/stock-5.jpg",
  ensaladas: "/images/stock-6.jpg",
  tortillas: "/images/stock-7.jpg",
  tartas: "/images/stock-8.jpg",
  veggie: "/images/stock-9.jpg",
};

const getCategoryImage = (id: string) => categoryImages[id] ?? "/images/stock-10.jpg";

export const CategorySection = ({
  category,
  onAddItem,
  onConsultItem,
}: CategorySectionProps) => {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-2xl font-semibold text-primary">{category.name}</h3>
        <p className="text-sm text-muted">Hecho en casa, como siempre.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {category.items
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              categoryName={category.name}
              imageSrc={item.image ?? getCategoryImage(category.id)}
              onAdd={(qty) =>
                onAddItem(item.id, qty, item.image ?? getCategoryImage(category.id))
              }
              onConsult={() => onConsultItem(item.name)}
            />
          ))}
      </div>
    </section>
  );
};
