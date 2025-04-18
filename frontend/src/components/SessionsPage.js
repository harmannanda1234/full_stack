// SessionsPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./sessions.css"

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchSessions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/session/${userId}/sessions`);
        const data = await res.json();
        setSessions(data.sessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="sessions-page">
      <h1>All Therapy Sessions</h1>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map(session => (
          <Link key={session.sessionId} to={`/session/${session.sessionId}`} className="session-link">
            <div className="session-item">
              <p><strong>Session ID:</strong> {session.sessionId}</p>
              <p><strong>status:</strong> new {session.status}</p>
              {/* <p><strong>status:</strong> new {session.status}</p> */}
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default SessionsPage;
