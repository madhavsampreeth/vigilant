import React, { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner.jsx";
import StatsCards from "../components/StatsCards.jsx";
import AlertFeed from "../components/AlertFeed.jsx";
import ActivityLog from "../components/ActivityLog.jsx";
import AnalyticsCharts from "../components/AnalyticsCharts.jsx";
import { getDashboardData } from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    try {
      const res = await getDashboardData();
      setData(res);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    }
  };

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <>
      <h1 className="page-title">COMMAND CENTER</h1>
      <p className="page-subtitle">
        Real-time anti-piracy operations overview
      </p>

      <div className="dashboard-grid">
        <div className="dashboard-hero">
          <HeroBanner />
        </div>

        <StatsCards stats={data.stats} />

        <div className= "dashboard-charts">
          <AnalyticsCharts stats={data.stats} />
        </div>

        <div className="dashboard-alerts">
          <AlertFeed alerts={data.threat_feed} />
        </div>

        <div className="dashboard-activity">
          <ActivityLog activities={data.recent_activity} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;