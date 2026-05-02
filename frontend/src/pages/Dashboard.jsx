import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
      const res = await axios.get(`${baseURL}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Welcome, {user?.name}!</h1>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '12px', color: '#D97706' }}>
            <Clock size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Pending Tasks</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{pendingTasks}</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#DBEAFE', borderRadius: '12px', color: '#2563EB' }}>
            <CheckSquare size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>In Progress</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{inProgressTasks}</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#D1FAE5', borderRadius: '12px', color: '#059669' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Completed</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{completedTasks}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No tasks found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Project: {task.project?.name}</p>
                </div>
                <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
