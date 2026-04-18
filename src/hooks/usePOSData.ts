import { useState, useEffect } from 'react';
import { InventoryItem, MenuItem, Order } from '../types';

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_pork_shoulder', name: 'Pork Shoulder', stock: 40, unit: 'lbs', threshold: 15 },
  { id: 'inv_beef_brisket', name: 'Beef Brisket (full-packer)', stock: 30, unit: 'lbs', threshold: 10 },
  { id: 'inv_chicken_thighs', name: 'Chicken Thighs', stock: 20, unit: 'lbs', threshold: 8 },
  { id: 'inv_ground_beef', name: 'Ground Beef (80/20)', stock: 15, unit: 'lbs', threshold: 6 },
  { id: 'inv_blueberries', name: 'Maine Blueberries (wild)', stock: 10, unit: 'lbs', threshold: 4 },
  { id: 'inv_brioche_buns', name: 'Brioche Buns', stock: 100, unit: 'each', threshold: 30 },
  { id: 'inv_maple_syrup', name: 'Maine Maple Syrup', stock: 128, unit: 'oz', threshold: 32 },
  { id: 'inv_cheese_curds', name: 'Wisconsin Cheese Curds', stock: 8, unit: 'lbs', threshold: 3 },
  { id: 'inv_sweet_tea', name: 'Sweet Tea Concentrate', stock: 96, unit: 'oz', threshold: 24 },
  { id: 'inv_bottled_water', name: 'Bottled Water', stock: 48, unit: 'each', threshold: 12 },
  { id: 'inv_takeout_containers', name: 'Takeout Containers (lg)', stock: 200, unit: 'each', threshold: 50 },
  { id: 'inv_receipt_paper', name: 'Thermal Paper Rolls', stock: 20, unit: 'each', threshold: 6 }
];

const INITIAL_MENU: MenuItem[] = [
  // Smoked & Grilled Plates
  {
    id: 'm_pulled_pork_plate',
    name: '12-Hour Carolina Pulled Pork Plate',
    price: 14.00,
    category: 'Smoked & Grilled Plates',
    color: 'bg-orange-800',
    recipe: [{ inventoryId: 'inv_pork_shoulder', amount: 0.5 }]
  },
  {
    id: 'm_brisket_plate',
    name: 'Smoked Beef Brisket Plate',
    price: 17.00,
    category: 'Smoked & Grilled Plates',
    color: 'bg-stone-800',
    recipe: [{ inventoryId: 'inv_beef_brisket', amount: 0.5 }]
  },
  {
    id: 'm_flame_chicken',
    name: 'Flame-Grilled Half Chicken',
    price: 15.00,
    category: 'Smoked & Grilled Plates',
    color: 'bg-amber-600',
    recipe: [{ inventoryId: 'inv_chicken_thighs', amount: 0.5 }]
  },
  {
    id: 'm_chicken_waffles',
    name: 'Maple Bourbon Chicken & Waffles',
    price: 16.00,
    category: 'Smoked & Grilled Plates',
    color: 'bg-amber-500',
    recipe: [
      { inventoryId: 'inv_chicken_thighs', amount: 0.4 },
      { inventoryId: 'inv_maple_syrup', amount: 2.0 }
    ]
  },
  {
    id: 'm_chili_bowl',
    name: 'Northern Loaded Chili Bowl',
    price: 13.00,
    category: 'Smoked & Grilled Plates',
    color: 'bg-red-800',
    recipe: [
      { inventoryId: 'inv_pork_shoulder', amount: 0.2 },
      { inventoryId: 'inv_ground_beef', amount: 0.3 }
    ]
  },

  // Burgers & Sandwiches
  {
    id: 'm_smash_burger',
    name: 'The Smash Burger',
    price: 16.00,
    category: 'Burgers & Sandwiches',
    color: 'bg-yellow-700',
    recipe: [
      { inventoryId: 'inv_ground_beef', amount: 0.4 },
      { inventoryId: 'inv_brioche_buns', amount: 1 }
    ]
  },
  {
    id: 'm_french_dip',
    name: 'The French Dip',
    price: 16.00,
    category: 'Burgers & Sandwiches',
    color: 'bg-stone-700',
    recipe: []
  },
  {
    id: 'm_pork_sandwich',
    name: 'Carolina Pulled Pork Sandwich',
    price: 15.00,
    category: 'Burgers & Sandwiches',
    color: 'bg-orange-700',
    recipe: [
      { inventoryId: 'inv_pork_shoulder', amount: 0.4 },
      { inventoryId: 'inv_brioche_buns', amount: 1 }
    ]
  },
  {
    id: 'm_chicken_sandwich',
    name: 'Crispy Fried Chicken Sandwich',
    price: 15.00,
    category: 'Burgers & Sandwiches',
    color: 'bg-amber-500',
    recipe: [
      { inventoryId: 'inv_chicken_thighs', amount: 0.4 },
      { inventoryId: 'inv_brioche_buns', amount: 1 }
    ]
  },

  // Wings & Drumsticks
  {
    id: 'm_wings',
    name: 'Southern Brined Wings',
    price: 16.00,
    category: 'Wings & Drumsticks',
    color: 'bg-red-700',
    recipe: []
  },
  {
    id: 'm_drumsticks',
    name: 'Smoked Drumsticks',
    price: 11.00,
    category: 'Wings & Drumsticks',
    color: 'bg-red-900',
    recipe: []
  },

  // Southern Sides
  {
    id: 'm_poutine',
    name: "The Fixin's Poutine",
    price: 10.00,
    category: 'Southern Sides',
    color: 'bg-yellow-600',
    recipe: [{ inventoryId: 'inv_cheese_curds', amount: 0.3 }]
  },
  {
    id: 'm_mac_cheese',
    name: 'Baked Mac & Cheese',
    price: 7.00,
    category: 'Southern Sides',
    color: 'bg-yellow-500',
    recipe: []
  },
  {
    id: 'm_biscuits',
    name: 'Maine Blueberry Biscuits',
    price: 5.00,
    category: 'Southern Sides',
    color: 'bg-blue-600',
    recipe: [{ inventoryId: 'inv_blueberries', amount: 0.1 }]
  },

  // Drinks
  {
    id: 'm_sweet_tea',
    name: 'Sweet Tea',
    price: 3.00,
    category: 'Drinks',
    color: 'bg-stone-600',
    recipe: [{ inventoryId: 'inv_sweet_tea', amount: 8 }]
  },
  {
    id: 'm_bottled_water',
    name: 'Bottled Water',
    price: 2.00,
    category: 'Drinks',
    color: 'bg-blue-400',
    recipe: [{ inventoryId: 'inv_bottled_water', amount: 1 }]
  },

  // Desserts & Bakery
  {
    id: 'm_blueberry_muffins',
    name: 'Maine Blueberry Muffins',
    price: 4.00,
    category: 'Desserts & Bakery',
    color: 'bg-blue-800',
    recipe: [{ inventoryId: 'inv_blueberries', amount: 0.1 }]
  },
  {
    id: 'm_snickerdoodle',
    name: 'Spiced Snickerdoodle Cookies',
    price: 3.00,
    category: 'Desserts & Bakery',
    color: 'bg-amber-700',
    recipe: []
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
