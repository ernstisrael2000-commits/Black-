import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthInit } from './hooks/useAuth';
import Layout from './components/layout/Layout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPromos from './pages/admin/AdminPromos';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppRoutes() {
  useAuthInit();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/boutique" element={<Layout><Shop /></Layout>} />
      <Route path="/produit/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/panier" element={<Layout><Cart /></Layout>} />
      <Route path="/paiement" element={<Layout><Checkout /></Layout>} />
      <Route path="/favoris" element={<Layout><Wishlist /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/a-propos" element={<Layout><About /></Layout>} />

      {/* Auth routes */}
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />

      {/* Account routes */}
      <Route path="/compte" element={<Layout><Account /></Layout>} />
      <Route path="/compte/commandes" element={<Layout><Account /></Layout>} />
      <Route path="/compte/commandes/:id" element={<Layout><OrderDetail /></Layout>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/produits" element={<AdminLayout><AdminProducts /></AdminLayout>} />
      <Route path="/admin/commandes" element={<AdminLayout><AdminOrders /></AdminLayout>} />
      <Route path="/admin/commandes/:id" element={<AdminLayout><AdminOrders /></AdminLayout>} />
      <Route path="/admin/promos" element={<AdminLayout><AdminPromos /></AdminLayout>} />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}
