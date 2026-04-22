import React, { useEffect, useState } from "react";
import "../styles/logs.css";
import { getDashboardData } from "../services/api";

const statusClass = (s) =>
  s === "PIRATED" || s === "Exact Match" || s === "Pirated"
    ? "threat"
    : s === "SAFE" || s === "Safe"
    ? "safe"
    : "info";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadLogs();

    const interval = setInterval(() => {
      loadLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    try {
      const res = await getDashboardData();

      const realLogs = (res.recent_activity || []).map((item, i) => {
        let action = "SYSTEM";
        let status = "INFO";
        let score = "—";

        if (item.action.includes("Asset registered")) {
          action = "REGISTER";
          status = "SUCCESS";
        } else if (item.action.includes("Safe")) {
          action = "ANALYZE";
          status = "SAFE";
          score = "Low";
        } else if (
          item.action.includes("Pirated") ||
          item.action.includes("flagged")
        ) {
          action = "ANALYZE";
          status = "PIRATED";
          score = "High";
        } else if (item.action.includes("Suspicious")) {
          action = "ANALYZE";
          status = "SUSPICIOUS";
          score = "Medium";
        }

        const videoName =
          item.action.split("-").length > 1
            ? item.action.split("-")[1].trim()
            : "unknown";

        return {
          ts: item.time || "Now",
          action,
          path: `/data/${videoName}`,
          status,
          score,
        };
      });

      setLogs(realLogs);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered =
    filter === "ALL"
      ? logs
      : logs.filter(
          (l) => l.status === filter || l.action === filter
        );

  return (
    <>
      <h1 className="page-title">ACTIVITY LOGS</h1>
      <p className="page-subtitle">
        Full audit trail of all system operations
      </p>

      <div className="glass-card logs-card">
        <div className="logs-header">
          <h2 className="logs-title">OPERATION LOG</h2>

          <div className="logs-controls">
            <select
              className="logs-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Events</option>
              <option value="PIRATED">Threats Only</option>
              <option value="SAFE">Safe Only</option>
              <option value="ANALYZE">Analyses</option>
              <option value="REGISTER">Registrations</option>
            </select>

            <span className="badge badge-info">
              {filtered.length} entries
            </span>
          </div>
        </div>

        <div className="logs-table-wrap">
          <table className="logs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>TIMESTAMP</th>
                <th>ACTION</th>
                <th>FILE PATH</th>
                <th>SCORE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((log, i) => (
                <tr key={i}>
                  <td className="logs-row-num">
                    {String(i + 1).padStart(2, "0")}
                  </td>

                  <td>{log.ts}</td>

                  <td className="action-col">
                    {log.action}
                  </td>

                  <td className="path-col">
                    {log.path}
                  </td>

                  <td
                    style={{
                      fontFamily: "var(--font-display)",
                      color:
                        log.status === "PIRATED"
                          ? "var(--red)"
                          : log.status === "SAFE"
                          ? "var(--green)"
                          : "var(--cyan)",
                    }}
                  >
                    {log.score}
                  </td>

                  <td>
                    <span
                      className={`badge badge-${statusClass(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Logs;