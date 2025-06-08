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

  const parseLog = (log, index) => {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(log);
      if (typeof parsed === "object" && parsed !== null) {
        return (
          <pre className="console-terminal-log" key={index}>
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      }
      return (
        <p className="console-terminal-log" key={index}>
          {String(parsed)}
        </p>
      );
    } catch {
      // Try to extract JSON object from within the log string
      const jsonMatch = log.match(/({.*}|\[.*\])$/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return (
            <span key={index}>
              <span className="console-terminal-log">
                {log.replace(jsonMatch[0], "")}
              </span>
              <pre className="console-terminal-log">
                {JSON.stringify(parsed, null, 2)}
              </pre>
            </span>
          );
        } catch {
          // If parsing fails, fall through to plain text
        }
      }
      // If log contains [object Object], show a warning
      if (log.includes("[object Object]")) {
        return (
          <p className="console-terminal-log" key={index}>
            {log.replace(
              "[object Object]",
              "(object not serializable, check server log formatting)"
            )}
          </p>
        );
      }
      // Otherwise, print as plain text
      return (
        <p className="console-terminal-log" key={index}>
          {log}
        </p>
      );
    }
  };

  return (
    <div ref={terminalRef} className="console-terminal">
      <h3 className="console-terminal-title">Terminal</h3>
      {error && <div className="console-terminal-error">{error}</div>}
      {logs.map((log, index) => parseLog(log, index))}
    </div>
  );
};

export default ConsoleTerminal;
