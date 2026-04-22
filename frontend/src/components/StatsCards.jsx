import React, { useEffect, useState } from "react";
import "../styles/cards.css";

function Counter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;

    if (end === 0) {
      setCount(0);
      return;
    }

    const duration = 1200;
    const stepTime = Math.max(20, Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}

function StatsCards({ stats }) {
  const cards = [
    {
      label: "Registered Assets",
      value: stats.registered_assets,
      color: "cyan",
    },
    {
      label: "Threat Alerts",
      value: stats.threat_alerts,
      color: "red",
    },
    {
      label: "Safe Streams",
      value: stats.safe_streams,
      color: "green",
    },
  ];

  return (
    <div className="dashboard-stats">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass-card stats-card ${card.color}`}
        >
          <div className="stats-card-label">{card.label}</div>

          <div className={`stats-value ${card.color}`}>
            <Counter value={card.value} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;