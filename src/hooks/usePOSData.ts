import { useState, useEffect } from 'react';
import { InventoryItem, MenuItem, Order } from '../types';

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_coffee_beans', name: 'Espresso Beans', stock: 5000, unit: 'g', threshold: 1000 },
  { id: 'inv_milk', name: 'Whole Milk', stock: 10000, unit: 'ml', threshold: 2000 },
  { id: 'inv_oat_milk', name: 'Oat Milk', stock: 5000, unit: 'ml', threshold: 1000 },
  { id: 'inv_sugar', name: 'Sugar', stock: 2000, unit: 'g', threshold: 500 },
  { id: 'inv_cups', name: 'Paper Cups (8oz)', stock: 300, unit: 'pcs', threshold: 50 },
  { id: 'inv_pastry_croissant', name: 'Croissant', stock: 20, unit: 'pcs', threshold: 5 },
  { id: 'inv_muffin', name: 'Blueberry Muffin', stock: 15, unit: 'pcs', threshold: 3 }
];

const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm_espresso',
    name: 'Espresso',
    price: 3.00,
    category: 'Coffee',
    color: 'bg-amber-800',
    recipe: [
      { inventoryId: 'inv_coffee_beans', amount: 18 },
      { inventoryId: 'inv_cups', amount: 1 }
    ]
  },
  {
    id: 'm_latte',
    name: 'Latte',
    price: 4.50,
    category: 'Coffee',
    color: 'bg-amber-600',
    recipe: [
      { inventoryId: 'inv_coffee_beans', amount: 18 },
      { inventoryId: 'inv_milk', amount: 200 },
      { inventoryId: 'inv_cups', amount: 1 }
    ]
  },
  {
    id: 'm_oat_latte',
    name: 'Oat Latte',
    price: 5.00,
    category: 'Coffee',
    color: 'bg-amber-700',
    recipe: [
      { inventoryId: 'inv_coffee_beans', amount: 18 },
      { inventoryId: 'inv_oat_milk', amount: 200 },
      { inventoryId: 'inv_cups', amount: 1 }
    ]
  },
  {
    id: 'm_croissant',
    name: 'Croissant',
    price: 4.00,
    category: 'Pastries',
    color: 'bg-orange-400',
    recipe: [
      { inventoryId: 'inv_pastry_croissant', amount: 1 }
    ]
  },
  {
    id: 'm_muffin',
    name: 'Muffin',
    price: 3.50,
    category: 'Pastries',
    color: 'bg-pink-800',
    recipe: [
      { inventoryId: 'inv_muffin', amount: 1 }
    ]
  }
];

export function usePOSData() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedInventory = localStorage.getItem('pos_inventory');
    const storedMenu = localStorage.getItem('pos_menu');
    const storedOrders = localStorage.getItem('pos_orders');

    if (storedInventory) setInventory(JSON.parse(storedInventory));
    else setInventory(INITIAL_INVENTORY);

    if (storedMenu) setMenuItems(JSON.parse(storedMenu));
    else setMenuItems(INITIAL_MENU);

    if (storedOrders) setOrders(JSON.parse(storedOrders));
    
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pos_inventory', JSON.stringify(inventory));
      localStorage.setItem('pos_menu', JSON.stringify(menuItems));
      localStorage.setItem('pos_orders', JSON.stringify(orders));
    }
  }, [inventory, menuItems, orders, isLoaded]);

  const processOrder = (order: Omit<Order, 'id' | 'timestamp'>) => {
    const newOrder: Order = {
      ...order,
      id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct inventory
    setInventory(prevInventory => {
      const inventoryUpdates = new Map<string, number>();
      
      // Calculate total deductions
      newOrder.items.forEach(cartItem => {
        cartItem.menuItem.recipe.forEach(recipeItem => {
          const currentDeduction = inventoryUpdates.get(recipeItem.inventoryId) || 0;
          inventoryUpdates.set(
            recipeItem.inventoryId, 
            currentDeduction + (recipeItem.amount * cartItem.quantity)
          );
        });
      });

      // Apply deductions
      return prevInventory.map(item => {
        const deduction = inventoryUpdates.get(item.id);
        if (deduction) {
          return { ...item, stock: item.stock - deduction };
        }
        return item;
      });
    });
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));
  };

  const clearData = () => {
    localStorage.removeItem('pos_inventory');
    localStorage.removeItem('pos_menu');
    localStorage.removeItem('pos_orders');
    setInventory(INITIAL_INVENTORY);
    setMenuItems(INITIAL_MENU);
    setOrders([]);
  };

  return {
    inventory,
    menuItems,
    orders,
    processOrder,
    updateInventoryStock,
    clearData,
    isLoaded
  };
}
