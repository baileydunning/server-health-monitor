import React, { useState, useEffect, useRef } from "react";

const QueryCampsites = () => {
  const [minElevation, setMinElevation] = useState("");
  const [maxElevation, setMaxElevation] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Build query string with updated parameter names
    const params = new URLSearchParams();

    if (minElevation && !isNaN(minElevation))
      params.append("min_elevation", minElevation);
    if (maxElevation && !isNaN(maxElevation))
      params.append("max_elevation", maxElevation);

    // Only add query parameters if at least one is provided
    const url = `http://localhost:3000/campsites?${params.toString()}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 24,
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="minElevation" style={{ marginBottom: 4 }}>
          Min Elevation (ft)
        </label>
        <input
          id="minElevation"
          type="number"
          value={minElevation}
          onChange={(e) => setMinElevation(e.target.value)}
          placeholder="e.g. 5000"
          style={{
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="maxElevation" style={{ marginBottom: 4 }}>
          Max Elevation (ft)
        </label>
        <input
          id="maxElevation"
          type="number"
          value={maxElevation}
          onChange={(e) => setMaxElevation(e.target.value)}
          placeholder="e.g. 10000"
          style={{
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          alignSelf: "flex-end",
          padding: "8px 16px",
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Loading..." : "Query Campsites"}
      </button>
    </form>
  );
};

export default QueryCampsites;
