import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Dashboard from './Dashboard';

const isDashboard = window.location.pathname === '/dashboard';

const root = document.getElementById('root')!;
createRoot(root).render(
  <StrictMode>
    {isDashboard ? <Dashboard /> : <App />}
  </StrictMode>
);
