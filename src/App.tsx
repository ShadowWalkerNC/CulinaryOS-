import React, { useState } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { RegisterView } from './views/RegisterView';
import { InventoryView } from './views/InventoryView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { usePOSData } from './hooks/usePOSData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('register');
  const { 
    inventory, 
    menuItems, 
    orders, 
    processOrder, 
    updateInventoryStock, 
    clearData,
    isLoaded
  } = usePOSData();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="text-center text-text-secondary">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-sans text-lg text-text-primary">Initializing Local Datastore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-deep text-text-primary overflow-hidden selection:bg-accent selection:text-bg-deep">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      
      <main className="flex-1 relative h-full">
        <div className={`absolute inset-0 transition-opacity duration-200 ${activeTab === 'register' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <RegisterView menuItems={menuItems} onProcessOrder={processOrder} />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-200 ${activeTab === 'inventory' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <InventoryView inventory={inventory} onUpdateStock={updateInventoryStock} />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-200 ${activeTab === 'analytics' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <AnalyticsView orders={orders} menuItems={menuItems} />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-200 ${activeTab === 'settings' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <SettingsView orders={orders} onClearData={clearData} />
        </div>
      </main>
    </div>
  );
}
