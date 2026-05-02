import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        Refine
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/projects" className={`nav-item ${location.pathname.startsWith('/projects') ? 'active' : ''}`}>
          <FolderKanban size={20} /> Projects
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
