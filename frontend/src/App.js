import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import SessionDetails from './components/SessionDetails';
import SessionsPage from './components/SessionsPage';
import './components/sessions.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/session/:sessionId" element={<SessionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
