// src/components/ServerHealth.js
import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const ServerHealth = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: "0%",
    memory: {
      rss: "0 MB",
      heapUsed: "0 MB",
      heapTotal: "0 MB",
      heapUsagePercent: "0%",
    },
  });
  const [uptime, setUptime] = useState(0);
  const [error, setError] = useState(null);

  // Fetch server metrics from /status endpoint
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setError(null);
        const response = await fetch("http://localhost:3000/status");
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        setUptime(data.uptime);
        setMetrics(data.metrics);
      } catch (err) {
        setError("Failed to fetch server metrics.");
        console.error("Error fetching server metrics:", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    const svg = d3.select("#cpuChart").attr("width", 500).attr("height", 100);
    const scale = d3.scaleLinear().domain([0, 100]).range([0, 400]);

    svg.selectAll("*").remove(); 

    svg
      .append("rect")
      .attr("x", 50)
      .attr("y", 40)
      .attr("width", 400)
      .attr("height", 20)
      .attr("fill", "#e0e0e0")
      .attr("rx", 10);

    // Usage bar (green to red gradient based on CPU usage)
    const usageColor = d3
      .scaleLinear()
      .domain([0, 100])
      .range(["#4caf50", "#f44336"]);

    svg
      .append("rect")
      .attr("x", 50)
      .attr("y", 40)
      .attr("width", scale(parseFloat(metrics.cpuUsage)))
      .attr("height", 20)
      .attr("fill", usageColor(parseFloat(metrics.cpuUsage)))
      .attr("rx", 10);

    // Text label for CPU usage
    svg
      .append("text")
      .attr("x", 250)
      .attr("y", 75)
      .attr("text-anchor", "middle")
      .text(`CPU Usage: ${metrics.cpuUsage}`)
      .attr("fill", "#333")
      .style("font-size", "16px")
      .style("font-weight", "bold");
  }, [metrics]);

  return (
    <div className="server-health-card">
      {error ? (
        <div className="server-health-error">{error}</div>
      ) : (
        <>
          <h2>Campsite Streaming Server Health</h2>
          <svg
            id="cpuChart"
            style={{ display: "block", margin: "0 auto" }}
          ></svg>
          <div className="server-health-metrics">
            <p>
              <strong>Memory Usage (Heap):</strong> {metrics.memory.heapUsed} /{" "}
              {metrics.memory.heapTotal} ({metrics.memory.heapUsagePercent})
            </p>
            <p>
              <strong>Memory RSS:</strong> {metrics.memory.rss}
            </p>
            <p>
              <strong>Uptime:</strong> {uptime} seconds
            </p>
          </div>
        </>
      )}
    </div>
  );
}


export default ServerHealth;
