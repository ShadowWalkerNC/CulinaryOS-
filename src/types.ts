export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  unit: string;
  threshold: number;
};

export type RecipeItem = {
  inventoryId: string;
  amount: number;
};

export type MenuItemCategory = string;

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuItemCategory;
  color: string;
  recipe: RecipeItem[];
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export type Order = {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
};
