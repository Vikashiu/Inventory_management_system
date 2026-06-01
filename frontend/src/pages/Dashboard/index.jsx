import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  Clock,
  BarChart3,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { customerService } from '../../services/customerService';
import { salesService } from '../../services/salesService';

// ─── Status Badge Component ────────────────────────────────────────────────────
const statusStyles = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
  DRAFT: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  SHIPPED: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  RECEIVED: 'bg-teal-100 text-teal-700 ring-teal-600/20',
  CANCELLED: 'bg-red-100 text-red-700 ring-red-600/20',
};

function StatusBadge({ status }) {
  const classes = statusStyles[status] || 'bg-slate-100 text-slate-600 ring-slate-500/20';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${classes}`}
    >
      {status}
    </span>
  );
}

// ─── Stat Card Component ────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, gradient, subtitle }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${gradient}`}
    >
      {/* Decorative background circle */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
              <TrendingUp size={12} />
              {subtitle}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodData, custData, ordData] = await Promise.all([
          productService.getAll(),
          customerService.getAll(),
          salesService.getAll(),
        ]);
        setProducts(prodData);
        setCustomers(custData);
        setOrders(ordData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // ── Derived Data ──────────────────────────────────────────────────────────────
  const lowStockProducts = products.filter(
    (p) => p.quantity_in_stock <= p.reorder_level
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
    .slice(0, 5);

  // ── Loading State ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-blue-400 opacity-20" />
          </div>
          <span className="text-sm font-medium text-slate-500">
            Loading dashboard…
          </span>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ─── Header ────────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>

      {/* ─── Stat Cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          subtitle="In inventory"
        />
        <StatCard
          title="Total Customers"
          value={customers.length}
          icon={Users}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          subtitle="Registered"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingCart}
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
          subtitle="All time"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
          subtitle="Need reorder"
        />
      </div>

      {/* ─── Two-Column Detail Panels ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ── Recent Orders Table ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-violet-500" />
              <h2 className="text-base font-semibold text-slate-800">
                Recent Orders
              </h2>
            </div>
            <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600">
              Latest 5
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
              <ShoppingCart size={32} strokeWidth={1.5} />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-3">Order #</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="whitespace-nowrap px-6 py-3.5 font-medium text-slate-800">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold text-slate-800">
                        ${Number(order.total_amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-right text-slate-500">
                        {new Date(order.order_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Low Stock Alerts ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <h2 className="text-base font-semibold text-slate-800">
                Low Stock Alerts
              </h2>
            </div>
            {lowStockProducts.length > 0 && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                {lowStockProducts.length} item{lowStockProducts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
              <Package size={32} strokeWidth={1.5} />
              <p className="text-sm">All products are well-stocked</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => {
                const stockPercent =
                  product.reorder_level > 0
                    ? Math.round(
                        (product.quantity_in_stock / product.reorder_level) * 100
                      )
                    : 0;
                const isOutOfStock = product.quantity_in_stock === 0;

                return (
                  <li
                    key={product.id}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        SKU: {product.sku}
                      </p>
                    </div>

                    <div className="ml-4 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isOutOfStock ? 'text-red-600' : 'text-amber-600'
                          }`}
                        >
                          {product.quantity_in_stock}
                        </span>
                        <span className="text-xs text-slate-400">
                          / {product.reorder_level}
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOutOfStock
                              ? 'bg-red-500'
                              : stockPercent <= 50
                              ? 'bg-amber-500'
                              : 'bg-yellow-400'
                          }`}
                          style={{
                            width: `${Math.min(stockPercent, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
