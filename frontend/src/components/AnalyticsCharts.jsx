import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

function AnalyticsCharts({ stats }) {
  const pieData = [
    { name: "Threats", value: stats.threat_alerts || 0 },
    { name: "Safe", value: stats.safe_streams || 0 },
  ];

  const barData = [
    { name: "Assets", count: stats.registered_assets || 0 },
    { name: "Threats", count: stats.threat_alerts || 0 },
    { name: "Safe", count: stats.safe_streams || 0 },
  ];

  const COLORS = ["#ff4d4f", "#00c853"];

  return (
    <div className="charts-grid">
      <div className="glass-card chart-card">
        <h3 className="chart-title">Threat Detection Ratio</h3>

        <div style={{ marginTop: "30px" }}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={110}
                innerRadius={55}
                paddingAngle={3}
                stroke="#fff"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "#050816",
                  border: "1px solid #00e5ff",
                  borderRadius: "10px",
                  color: "#fff"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card chart-card">
        <h3 className="chart-title">Platform Overview</h3>

        <div style={{ marginTop: "30px" }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.12)"
              />
              <XAxis dataKey="name" stroke="#9aa4b2" />
              <YAxis stroke="#9aa4b2" />

              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  background: "#050816",
                  border: "1px solid #00e5ff",
                  borderRadius: "10px",
                  color: "#fff"
                }}
              />

              <Legend />

              <Bar
                dataKey="count"
                fill="#00e5ff"
                radius={[8, 8, 0, 0]}
                activeBar={{
                  fill: "#00ffff",
                  stroke: "#ffffff",
                  strokeWidth: 2
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCharts;