import React from 'react';
import { Store, Package, TrendingUp, Settings as SettingsIcon, FileText } from 'lucide-react';

export type TabId = 'register' | 'inventory' | 'analytics' | 'settings' | 'buildplan';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const tabs = [
    { id: 'register' as TabId, label: 'Register', icon: Store },
    { id: 'inventory' as TabId, label: 'Inventory', icon: Package },
    { id: 'analytics' as TabId, label: 'Analytics', icon: TrendingUp },
    { id: 'settings' as TabId, label: 'Settings', icon: SettingsIcon },
    { id: 'buildplan' as TabId, label: 'Build Plan', icon: FileText }
  ];

  return (
    <div className="w-[80px] bg-bg-surface border-r border-border-subtle flex flex-col items-center py-6 gap-8 h-screen flex-shrink-0">
      <div className="font-serif italic text-2xl text-accent mb-auto font-bold">
        C
      </div>

      <nav className="flex flex-col gap-4 w-full px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl cursor-pointer transition-all border-none ${
                isActive 
                  ? 'bg-accent text-bg-deep' 
                  : 'bg-transparent text-text-secondary hover:bg-bg-accent hover:text-text-primary'
              }`}
              title={tab.label}
            >
              <Icon size={24} className={isActive ? 'text-bg-deep' : ''} />
            </button>
          );
        })}
      </nav>

      <div className="mt-auto text-[#4CAF50] pb-2" title="Offline Ready">
        <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></div>
      </div>
    </div>
  );
}
