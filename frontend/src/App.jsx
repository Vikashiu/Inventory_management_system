import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from 'react-hot-toast';
import ProductsPage from './pages/Products';
import CustomersPage from './pages/Customers/index';
import SalesPage from './pages/Sales/index';
import DashboardPage from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* All routes inside this wrapper get the Sidebar & Navbar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;