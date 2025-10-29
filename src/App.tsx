import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OngLayout from './components/OngLayout';
import Home from './pages/Home/index';
import About from './pages/About/index';
import Login from './pages/Login';
import OngDashboard from './pages/OngDashboard';
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
            {/* Add more nested routes here later */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
