import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight,
  Box
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Product Management', icon: Package, path: '/products' },
    { name: 'Customer Management', icon: Users, path: '/customers' },
    { name: 'Sales Management', icon: ShoppingCart, path: '/sales' },
  ];

  return (
    <aside 
      className={`bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* App Logo / Name */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <Box className="text-blue-500 mr-2" size={24} />
        {!isCollapsed && <span className="text-white font-bold text-lg tracking-wide">InvenTrack</span>}
      </div>

      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-slate-800 text-white rounded-full p-1 border border-slate-700 hover:bg-slate-700 transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-3 rounded-lg transition-colors group
              ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
            title={isCollapsed ? item.name : ''}
          >
            <item.icon size={20} className={!isCollapsed ? 'mr-3' : ''} />
            {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}