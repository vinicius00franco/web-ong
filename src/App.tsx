import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './AppRoutes';
import { MockToggle } from './components/MockToggle';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <MockToggle />
      </Router>
    </AuthProvider>
  );
}

export default App;
