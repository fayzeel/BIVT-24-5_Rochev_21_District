import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Districts from './pages/Districts';
import InfrastructureObjects from './pages/InfrastructureObjects';
import Events from './pages/Events';
import InfrastructureTypes from './pages/InfrastructureTypes';
import Login from './pages/Login';
import './index.css';

// Компонент для защиты маршрутов
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="container">Загрузка...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <Router>
      {user && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Districts />
            </ProtectedRoute>
          } />
          <Route path="/objects" element={
            <ProtectedRoute>
              <InfrastructureObjects />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/types" element={
            <ProtectedRoute>
              <InfrastructureTypes />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;