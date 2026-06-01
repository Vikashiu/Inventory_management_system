import React from 'react';
import { Edit2, Trash2, Mail, Phone, User } from 'lucide-react';

export default function CustomerTable({ customers, onEdit, onDelete }) {
  
  // Helper function to extract initials for the avatar
  const getInitials = (fullName) => {
    if (!fullName) return <User size={18} />;
    const parts = fullName.split(' ').filter(Boolean);
    if (parts.length === 0) return <User size={18} />;
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <th className="px-6 py-4">Customer Name</th>
            <th className="px-6 py-4 text-center">ID</th>
            <th className="px-6 py-4">Email Address</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {customers.map((customer) => {
            const displayName = customer.full_name || '';

            return (
              <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                
                {/* 1. Name & Avatar Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {getInitials(displayName)}
                    </div>
                    <span className="font-semibold text-slate-900">
                      {displayName || <span className="text-slate-400 italic">No Name Provided</span>}
                    </span>
                  </div>
                </td>

                {/* 2. Customer ID Column */}
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-mono font-medium rounded bg-slate-100 text-slate-500 border border-slate-200">
                    #{customer.id}
                  </span>
                </td>

                {/* 3. Email Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.email ? (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={14} className="text-slate-400" /> 
                      <span className="hover:text-blue-600 transition-colors cursor-pointer">{customer.email}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">—</span>
                  )}
                </td>

                {/* 4. Phone Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.phone ? (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={14} className="text-slate-400" /> 
                      <span>{customer.phone}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">—</span>
                  )}
                </td>

                {/* 5. Actions Column */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => onEdit(customer)} 
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(customer.id)} 
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}