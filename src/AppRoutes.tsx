import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import OngLayout from './components/OngLayout';
import GlobalLayout from './components/GlobalLayout';
import Home from './pages/Home/index';
import About from './pages/About/index';
import Login from './pages/Login';
import OngDashboard from './pages/OngDashboard';
import { ProductsPage } from './pages/Products';
import { CreateProductPage } from './pages/Products/CreateProduct';
import { EditProductPage } from './pages/Products/EditProduct';

export const AppRoutes = () => (
  <Routes>
    <Route element={<GlobalLayout />}>
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
      </Route>
    </Route>
  </Routes>
)
