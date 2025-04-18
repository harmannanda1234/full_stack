import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Fix

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ Fix: must be inside component

  const [sessions, setSessions] = useState([]);
  const [recording, setRecording] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [userId, setUserId] = useState('');
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchSessions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/${userId}/sessions`);
        const data = await res.json();
        setSessions(data.sessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };
    fetchSessions();
  }, [userId]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startSession = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      setRecording(true);
      setCurrentSessionId(data.sessionId);
      await startCamera();
    } catch (err) {
      console.error("Error starting session:", err);
    }
  };

  const endSession = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/session/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          sessionId: currentSessionId,
          aiResult: "Sample AI feedback",
          audioUrl: "http://example.com/audio.mp3",
          videoUrl: "./static/332725"
        })
      });
      const data = await res.json();
      console.log(data.message);
      setRecording(false);
      setCurrentSessionId(null);
      stopCamera();
    } catch (err) {
      console.error("Error ending session:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <button className="logout" onClick={logout}>Logout</button>
      <h1>AI Therapist Dashboard</h1>

      <div className="sessions-list">
        <h2>Previous Sessions</h2>
        {sessions.map(session => (
          <Link key={session.sessionId} to={`/session/${session._id}`} className="session-link">
            <div className="session-item">
              <p>Session ID: {session.sessionId}</p>
              <p>Date: {new Date(session.endTime._seconds * 1000).toLocaleString()}</p>
            </div>
          </Link>
        ))}
        {/* ✅ Clean View All Button */}
        <button className="view-sessions-btn" onClick={() => navigate('/sessions')}>
          View All Sessions
        </button>
      </div>

      <div className="stats">
        <div className="card">
          <h2>Status</h2>
          <p>{recording ? "Recording" : "Not Recording"}</p>
        </div>
        <div className="card">
          <h2>Actions</h2>
          <button onClick={startSession}>Start Session</button>
          <button onClick={endSession} disabled={!recording}>End Session</button>
        </div>
      </div>

      <div className="therapy-session">
        <h2>Therapy Session</h2>
        <p>Click "Start Session" to begin recording your therapy session.</p>
        <div className="session-box">
          {recording ? (
            <video ref={videoRef} autoPlay muted className="video-feed" />
          ) : (
            <p>No active session</p>
          )}
        </div>
        <p className="note">Your recordings are securely processed by our AI system.</p>
      </div>
    </div>
  );
};

export default Dashboard;

