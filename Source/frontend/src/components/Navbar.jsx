import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink to="/" className="navbar-brand">
          🏛️ Районы города
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            Районы
          </NavLink>
          <NavLink to="/objects" className={({ isActive }) => isActive ? 'active' : ''}>
            Объекты
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => isActive ? 'active' : ''}>
            События
          </NavLink>
          <NavLink to="/types" className={({ isActive }) => isActive ? 'active' : ''}>
            Типы
          </NavLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {user?.name} ({user?.role === 'admin' ? 'Админ' : 'Просмотр'})
          </span>
          <button className="btn btn-secondary" onClick={logout}>
            Выйти
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;