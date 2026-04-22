import React from "react";
import "../styles/logs.css";

function ActivityLog({ activities = [] }) {
  return (
    <div className="glass-card activity-log-card">
      <h2 className="activity-log-title">RECENT ACTIVITY</h2>

      <div className="activity-list">
        {activities.length === 0 ? (
          <div className="activity-item">
            <div className="activity-content">
              <div className="activity-action">No recent activity</div>
              <div className="activity-time">Now</div>
            </div>
          </div>
        ) : (
          activities.map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-content">
                <div className="activity-action">
                  {item.action}
                </div>

                <div className="activity-time">
                  {item.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivityLog;