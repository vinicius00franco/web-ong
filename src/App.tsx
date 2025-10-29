import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OngLayout from './components/OngLayout';
import Home from './pages/Home/index';
import About from './pages/About/index';
import Login from './pages/Login';
import OngDashboard from './pages/OngDashboard';
import { ProductsPage } from './pages/Products';
import { CreateProductPage } from './pages/Products/CreateProduct';
import { EditProductPage } from './pages/Products/EditProduct';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ong" element={
            <ProtectedRoute>
              <OngLayout />
            </ProtectedRoute>
          }>
            <Route index element={<OngDashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<CreateProductPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            {/* Add more nested routes here later */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
