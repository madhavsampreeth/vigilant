import React from "react";
import AnalyzePanel from "../components/AnalyzePanel";

function Analyze() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">ANALYZE STREAM</h1>
        <p className="page-subtitle">
           Upload suspect video and compare against database
        </p>
      </div>

      <div className="page-body">
        <AnalyzePanel />
      </div>
    </div>
  );
}

export default Analyze;