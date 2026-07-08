import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Layout from './components/Layout';
import Warehouses from './features/warehouses/Warehouses';
import Purchase from './features/purchase/Purchase';
import Sales from './features/sales/Sales';
import Inventory from './features/inventory/Inventory';
import Settings from './features/settings/Settings';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;