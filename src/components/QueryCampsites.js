import React, { useState } from "react";
import "../App.css";

const QueryCampsites = () => {
  const [minElevation, setMinElevation] = useState("");
  const [maxElevation, setMaxElevation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (minElevation && !isNaN(minElevation))
      params.append("min_elevation", minElevation);
    if (maxElevation && !isNaN(maxElevation))
      params.append("max_elevation", maxElevation);

    const url = `http://localhost:3000/campsites?${params.toString()}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="query-campsites-form">
        <div className="query-campsites-field">
          <label htmlFor="minElevation" className="query-campsites-label">
            Min Elevation (ft)
          </label>
          <input
            id="minElevation"
            type="number"
            value={minElevation}
            onChange={(e) => setMinElevation(e.target.value)}
            placeholder="e.g. 5000"
            className="query-campsites-input"
          />
        </div>

        <div className="query-campsites-field">
          <label htmlFor="maxElevation" className="query-campsites-label">
            Max Elevation (ft)
          </label>
          <input
            id="maxElevation"
            type="number"
            value={maxElevation}
            onChange={(e) => setMaxElevation(e.target.value)}
            placeholder="e.g. 10000"
            className="query-campsites-input"
          />
        </div>

        <button
          type="submit"
          className="query-campsites-button"
          disabled={loading}
        >
          {loading ? "Loading..." : "Query Campsites"}
        </button>
      </form>

      {error && (
        <div className="query-campsites-error">
          {error}
        </div>
      )}
    </>
  );
};

export default QueryCampsites;
