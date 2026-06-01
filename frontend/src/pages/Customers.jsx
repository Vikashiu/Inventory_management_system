// import React from 'react';

// const Customers = () => {
//   return (
//     <div className="flex flex-col h-full bg-white shadow-sm rounded-lg border border-gray-200">
      
//       {/* Top Action Bar */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//         <div className="flex items-center gap-2 cursor-pointer group">
//           <h1 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">All Customers</h1>
//           <svg className="w-4 h-4 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-colors">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//             </svg>
//             New
//           </button>
//           <button className="p-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Empty State Center Content */}
//       <div className="flex flex-col items-center justify-center flex-1 px-4 text-center bg-gray-50/30">
        
//         {/* Wireframe Graphic Placeholder (Customer Icon) */}
//         <div className="relative w-48 h-48 mb-6">
//           <div className="absolute inset-0 bg-blue-50 rounded-full opacity-50"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//              <svg className="w-24 h-24 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//              </svg>
//           </div>
//         </div>

//         <h2 className="mb-3 text-2xl font-bold text-gray-900">Manage Your Customers</h2>
        
//         <p className="max-w-md mb-8 text-gray-500">
//           Keep track of the people and businesses you sell to. Add customers here to start creating seamless sales orders.
//         </p>
        
//         <button className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-colors">
//           Add New Customer
//         </button>
//       </div>
      
//     </div>
//   );
// };

// export default Customers;