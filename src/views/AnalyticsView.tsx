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

  const COLORS = ['#C68642', '#E5E5E5', '#999999', '#252525', '#0F0F0F'];

  return (
    <div className="p-8 h-full overflow-y-auto bg-bg-deep text-text-primary">
      <div className="flex items-center mb-6">
        <TrendingUp className="mr-3 text-accent" size={32} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans text-text-primary">Analytics & Reporting</h1>
          <p className="text-text-secondary mt-1">Performance insights derived directly from local device data</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-bg-surface p-6 rounded-xl shadow-sm border border-border-subtle flex items-center">
          <div className="p-4 bg-bg-accent rounded-lg mr-4 border border-border-subtle">
            <DollarSign className="text-accent" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Total Lifetime Revenue</p>
            <p className="text-3xl font-bold font-mono tracking-tight text-text-primary">${totalRevenueAllTime.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-bg-surface p-6 rounded-xl shadow-sm border border-border-subtle flex items-center">
          <div className="p-4 bg-bg-accent rounded-lg mr-4 border border-border-subtle">
            <Receipt className="text-text-primary" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Total Orders Processed</p>
            <p className="text-3xl font-bold font-mono tracking-tight text-text-primary">{totalOrdersAllTime}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-bg-surface p-6 rounded-xl shadow-sm border border-border-subtle lg:col-span-2 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 w-full text-left text-text-primary">Revenue Last 7 Days</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C68642" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C68642" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} tickMargin={10} />
                <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value}`} tickMargin={10} />
                <RechartsTooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                  contentStyle={{ backgroundColor: 'var(--bg-accent)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-color)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#C68642" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Items Pie */}
        <div className="bg-bg-surface p-6 rounded-xl shadow-sm border border-border-subtle flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 w-full text-left text-text-primary">Top Selling Items (Quantity)</h3>
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
              <div className="h-full flex items-center justify-center text-text-secondary">
                No sales data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
