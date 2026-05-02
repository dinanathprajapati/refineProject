import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <User size={20} color="var(--primary)" />
          {user?.name} ({user?.role})
        </div>
        <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
