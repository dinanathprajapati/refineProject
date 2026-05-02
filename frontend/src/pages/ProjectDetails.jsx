import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigneeId: '', status: 'PENDING' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      const res = await axios.get(`${baseURL}/api/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      const res = await axios.get(`${baseURL}/api/auth/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      await axios.post(`${baseURL}/api/tasks`, { ...newTask, projectId: id });
      setShowModal(false);
      setNewTask({ title: '', description: '', assigneeId: '', status: 'PENDING' });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      await axios.put(`${baseURL}/api/tasks/${taskId}/status`, { status });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      await axios.delete(`${baseURL}/api/tasks/${taskId}`);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      await axios.delete(`${baseURL}/api/projects/${id}`);
      navigate('/projects');
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user?.role === 'ADMIN' && (
            <button className="btn btn-danger" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={handleDeleteProject}>
              <Trash2 size={16} /> Delete Project
            </button>
          )}
          {user?.role === 'ADMIN' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Add Task
            </button>
          )}
        </div>
      </div>

      <div className="grid-3">
        {/* Kanban Board Columns */}
        {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
          <div key={status} className="card" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              {status.replace('_', ' ')}
              <span className="badge" style={{ background: 'var(--border)' }}>
                {project.tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {project.tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="card" style={{ padding: '1rem' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                      {task.assignee ? task.assignee.name : 'Unassigned'}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select 
                        className="form-select" 
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      {user?.role === 'ADMIN' && (
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" className="form-input" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select className="form-select" value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectDetails;
