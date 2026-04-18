import React from 'react';
import { InventoryItem } from '../types';
import { Package, AlertTriangle } from 'lucide-react';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onUpdateStock: (id: string, newStock: number) => void;
}

export function InventoryView({ inventory, onUpdateStock }: InventoryViewProps) {
  return (
    <div className="p-8 h-full overflow-y-auto bg-bg-deep text-text-primary">
      <div className="flex items-center mb-6">
        <Package className="mr-3 text-accent" size={32} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans text-text-primary">Inventory Management</h1>
          <p className="text-text-secondary mt-1">Track ingredients and stock levels</p>
        </div>
      </div>

      <div className="bg-bg-surface rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-accent border-b border-border-subtle text-text-secondary text-sm tracking-wide">
              <th className="p-4 font-medium">Item Name</th>
              <th className="p-4 font-medium text-right">Current Stock</th>
              <th className="p-4 font-medium">Unit</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {inventory.map(item => {
              const isLow = item.stock <= item.threshold;
              
              return (
                <tr key={item.id} className="hover:bg-bg-accent transition-colors">
                  <td className="p-4 font-medium text-text-primary">{item.name}</td>
                  <td className="p-4 text-right font-mono text-lg">
                    <span className={isLow ? "text-red-500 font-bold" : "text-text-primary"}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary font-mono text-sm">{item.unit}</td>
                  <td className="p-4">
                    {isLow ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900">
                        <AlertTriangle size={14} className="mr-1" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900">
                        Good
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => onUpdateStock(item.id, item.stock + (item.unit === 'oz' || item.unit === 'lbs' ? 10 : 100))}
                        className="px-3 py-1 bg-bg-accent text-text-primary border border-border-subtle rounded hover:border-accent hover:text-accent transition-colors text-sm font-medium"
                      >
                        + Add Restock
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
