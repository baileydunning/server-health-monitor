import React, { useEffect, useState, useRef } from "react";
import "../App.css"; 

const ConsoleTerminal = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    let socket;

    try {
      socket = new WebSocket("ws://localhost:3000");
    } catch (err) {
      setError("Failed to create WebSocket.");
      return;
    }

    socket.onopen = () => setError(null);

    socket.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    };

    socket.onerror = () => {
      setError("WebSocket error. Check console and server logs.");
    };

    socket.onclose = (e) => {
      if (!e.wasClean) {
        setError(`Unexpected close (${e.code})`);
      }
    };

    return () => socket && socket.close();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div ref={terminalRef} className="console-terminal">
      <h3 className="console-terminal-title">Terminal</h3>
      {error && (
        <div className="console-terminal-error">
          {error}
        </div>
      )}
      {logs.map((log, i) => (
        <p key={i} className="console-terminal-log">
          {log}
        </p>
      ))}
    </div>
  );
};

export default ConsoleTerminal;
