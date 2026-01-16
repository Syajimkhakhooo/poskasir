import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import StockOpname from './pages/StockOpname';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="finance" element={<Finance />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="stock-opname" element={<StockOpname />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
