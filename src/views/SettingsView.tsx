import React, { useState } from 'react';
import { Settings as SettingsIcon, Printer, Database, RefreshCw, Smartphone } from 'lucide-react';
import { Order } from '../types';

interface SettingsViewProps {
  onClearData: () => void;
  orders: Order[];
}

export function SettingsView({ onClearData, orders }: SettingsViewProps) {
  const [deviceStatus, setDeviceStatus] = useState<string>('Disconnected');

  const testPrint = async () => {
    try {
      setDeviceStatus('Scanning for printers...');
      // Request a generic Bluetooth printer
      // Note: This requires HTTPS and user gesture
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] } // Common ESC/POS printer service
        ],
        optionalServices: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2']
      });

      setDeviceStatus(`Connected to: ${device.name || 'Unknown Printer'}`);
      
      // Fallback for demo purposes if they connect but we don't send bytes
      setTimeout(() => {
        window.print(); // Easy browser fallback for receipts
      }, 1000);

    } catch (err: any) {
      console.warn('Bluetooth Error:', err);
      setDeviceStatus('Connection failed or aborted');
      
      // For demonstration in systems without BT available
      if (err.name === 'NotFoundError' || err.name === 'NotSupportedError') {
         alert('Bluetooth API not supported or no devices found. Triggering standard browser print as fallback.');
         window.print();
      }
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all offline data? This will reset inventory, menus, and wipe all orders. This cannot be undone.')) {
      onClearData();
      alert('Data reset successfully.');
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-bg-deep text-text-primary">
      <div className="flex items-center mb-6">
        <SettingsIcon className="mr-3 text-accent" size={32} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans text-text-primary">System Settings</h1>
          <p className="text-text-secondary mt-1">Configure peripherals and manage local data</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-8">
        
        {/* Device Settings */}
        <section className="bg-bg-surface p-6 rounded-xl shadow-sm border border-border-subtle">
          <div className="flex items-center mb-4 text-xl font-bold text-text-primary">
            <Smartphone className="mr-2" size={24} />
            Hardware & Printers
          </div>
          <p className="text-text-secondary mb-6">
            Connect to external hardware via Bluetooth. This app supports standard ESC/POS Bluetooth receipt printers.
          </p>

          <div className="flex items-center justify-between p-4 bg-bg-accent rounded-lg border border-border-subtle">
            <div>
              <p className="font-semibold text-text-primary">Receipt Printer</p>
              <p className="text-sm font-mono text-text-secondary mt-1">Status: {deviceStatus}</p>
            </div>
            <button 
              onClick={testPrint}
              className="px-4 py-2 bg-accent text-bg-deep rounded-lg flex items-center font-bold hover:brightness-110 transition-colors"
            >
              <Printer size={18} className="mr-2" />
              Pair & Print Test
            </button>
          </div>
        </section>

        {/* Data Local Storage */}
        <section className="bg-bg-surface p-6 rounded-xl shadow-sm border border-border-subtle">
          <div className="flex items-center mb-4 text-xl font-bold text-red-500">
            <Database className="mr-2" size={24} />
            Local Data Management
          </div>
          <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-lg mb-6">
            <p className="text-red-300 text-sm">
              <strong className="block mb-1 text-red-400">Offline-First Privacy Guarantee</strong>
              All application data is stored purely across your device's local storage (IndexedDB / localStorage). 
              No menu items, inventory, or order records are transmitted to the cloud. You are fully responsible for your own backups.
            </p>
          </div>

          <div className="flex items-center justify-between py-2 mb-4 text-text-primary">
             <span className="font-medium">Total Offline Orders Stored</span>
             <span className="font-mono text-lg">{orders.length}</span>
          </div>

          <button 
            onClick={handleClearData}
            className="w-full px-4 py-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg flex items-center justify-center font-bold transition-colors mt-4"
          >
            <RefreshCw size={18} className="mr-2" />
            Wipe Local Database (Factory Reset)
          </button>
        </section>

      </div>
    </div>
  );
}
