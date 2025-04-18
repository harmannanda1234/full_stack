import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Login.css';
import { jwtDecode } from 'jwt-decode';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();



  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const token = res.data.token;
      const decoded = jwtDecode(token); // ✅ fixed here
      localStorage.setItem('token', token);
      localStorage.setItem('userId', decoded.userId); // ✅ Store userId from token
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  
  

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <a href="/signup">Don't have an account? Sign up</a>
    </div>
  );
}