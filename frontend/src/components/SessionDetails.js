import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SessionDetails = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchSession = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/${userId}/sessions/${sessionId}`);
        const data = await res.json();
        setSession(data.session);
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (!session) return <div>Loading session details...</div>;

  return (
    <div className="session-details">
      <h2>Session Details</h2>
      <p><strong>Session ID:</strong> {session._id}</p>
      <p><strong>Date:</strong> {new Date(session.timestamp).toLocaleString()}</p>
      <p><strong>AI Result:</strong> {session.aiResult}</p>
      <p><strong>Audio:</strong> <a href={session.audioUrl} target="_blank" rel="noreferrer">Listen</a></p>
      <p><strong>Video:</strong> <a href={session.videoUrl} target="_blank" rel="noreferrer">Watch</a></p>
    </div>
  );
};

export default SessionDetails;
