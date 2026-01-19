import type { MenuCategory } from "../types";
import { MenuItemRow } from "./MenuItemRow";

type CategorySectionProps = {
  category: MenuCategory;
  onAddItem: (itemId: string) => void;
  onConsultItem: (itemName: string) => void;
};

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
      <div className="space-y-3">
        {category.items
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              onAdd={() => onAddItem(item.id)}
              onConsult={() => onConsultItem(item.name)}
            />
          ))}
      </div>
    </section>
  );
};
