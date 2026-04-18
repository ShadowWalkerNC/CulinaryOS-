import React, { useMemo } from 'react';
import { Order, MenuItem } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { TrendingUp, DollarSign, Receipt } from 'lucide-react';

interface AnalyticsViewProps {
  orders: Order[];
  menuItems: MenuItem[];
}

export function AnalyticsView({ orders, menuItems }: AnalyticsViewProps) {
  // Aggregate sales data per item
  const itemSales = useMemo(() => {
    const salesMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.menuItem.id;
        const current = salesMap.get(id) || { name: item.menuItem.name, quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += (item.quantity * item.menuItem.price);
        salesMap.set(id, current);
      });
    });

    return Array.from(salesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5); // top 5
  }, [orders]);

  // Aggregate daily revenue (last 7 days)
  const dailyRevenue = useMemo(() => {
    const revenueMap = new Map<string, number>();
    const today = startOfDay(new Date());

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      revenueMap.set(format(d, 'MMM dd'), 0);
    }

    orders.forEach(order => {
      const orderDate = format(new Date(order.timestamp), 'MMM dd');
      if (revenueMap.has(orderDate)) {
        revenueMap.set(orderDate, (revenueMap.get(orderDate) || 0) + order.total);
      }
    });

    return Array.from(revenueMap.entries()).map(([date, total]) => ({ date, total }));
  }, [orders]);

  const totalRevenueAllTime = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersAllTime = orders.length;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 text-gray-900">
      <div className="flex items-center mb-6">
        <TrendingUp className="mr-3 text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans">Analytics & Reporting</h1>
          <p className="text-gray-500 mt-1">Performance insights derived directly from local device data</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-4 bg-green-100 rounded-lg mr-4">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Lifetime Revenue</p>
            <p className="text-3xl font-bold font-mono tracking-tight">${totalRevenueAllTime.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-4 bg-blue-100 rounded-lg mr-4">
            <Receipt className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders Processed</p>
            <p className="text-3xl font-bold font-mono tracking-tight">{totalOrdersAllTime}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 w-full text-left">Revenue Last 7 Days</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} tickMargin={10} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} prefix="$" tickMargin={10} />
                <RechartsTooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Items Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 w-full text-left">Top Selling Items (Quantity)</h3>
          <div className="w-full h-80">
            {itemSales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={itemSales}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="quantity"
                  >
                    {itemSales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No sales data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
