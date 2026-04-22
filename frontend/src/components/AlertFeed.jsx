import React from "react";
import "../styles/cards.css";

function AlertFeed({ alerts = [] }) {
  return (
    <div className="glass-card alert-feed-card">
      <h2 className="alert-feed-title">THREAT ALERT FEED</h2>

      <div className="alert-list">
        {alerts.length === 0 ? (
          <div className="alert-item">
            <div className="alert-item-body">
              <div className="alert-item-title">No active threats</div>
              <div className="alert-item-meta">System secure</div>
            </div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="alert-item">
              <div className="alert-item-body">
                <div className="alert-item-title">
                  {alert.title}
                </div>

                <div className="alert-item-meta">
                  {alert.ip} • {alert.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertFeed;