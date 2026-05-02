import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      const res = await axios.get(`${baseURL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      await axios.delete(`${baseURL}/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      await axios.post(`${baseURL}/api/projects`, newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      <div className="grid-3">
        {projects.map(project => (
          <div key={project.id} className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>{project.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', minHeight: '40px' }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {project._count.tasks} Tasks
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {user?.role === 'ADMIN' && (
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 size={14} />
                  </button>
                )}
                <Link to={`/projects/${project.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create Project</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" className="form-input" required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Projects;
