import React from 'react';
import { InventoryItem } from '../types';
import { Package, AlertTriangle } from 'lucide-react';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onUpdateStock: (id: string, newStock: number) => void;
}

export function InventoryView({ inventory, onUpdateStock }: InventoryViewProps) {
  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-900">
      <div className="flex items-center mb-6">
        <Package className="mr-3 text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Track ingredients and stock levels</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm tracking-wide">
              <th className="p-4 font-medium">Item Name</th>
              <th className="p-4 font-medium text-right">Current Stock</th>
              <th className="p-4 font-medium">Unit</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map(item => {
              const isLow = item.stock <= item.threshold;
              
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{item.name}</td>
                  <td className="p-4 text-right font-mono text-lg">
                    <span className={isLow ? "text-red-600 font-bold" : "text-gray-700"}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-sm">{item.unit}</td>
                  <td className="p-4">
                    {isLow ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle size={14} className="mr-1" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Good
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => onUpdateStock(item.id, item.stock + (item.unit === 'g' || item.unit === 'ml' ? 1000 : 10))}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
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
