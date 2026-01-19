import type { MenuCategory, MenuData, MenuItem } from "../types";

export const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

export const filterMenu = (
  data: MenuData,
  query: string,
  categoryId: string | "all",
  tags: string[]
) => {
  const normalizedQuery = normalizeText(query);
  const activeCategories = data.categories
    .filter((category) => category.isActive)
    .map<MenuCategory>((category) => ({
      ...category,
      items: category.items.filter((item) => item.isActive),
    }));

  const filtered = activeCategories
    .filter((category) => (categoryId === "all" ? true : category.id === categoryId))
    .map<MenuCategory>((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          normalizeText(item.name + " " + item.description).includes(normalizedQuery);
        const matchesTags =
          tags.length === 0 || tags.every((tag) => item.tags.includes(tag));
        return matchesQuery && matchesTags;
      }),
    }))
    .filter((category) => category.items.length > 0)
    .sort((a, b) => a.order - b.order);

  return filtered;
};

export const flattenMenuItems = (data: MenuData): MenuItem[] =>
  data.categories
    .filter((category) => category.isActive)
    .flatMap((category) => category.items)
    .filter((item) => item.isActive);
