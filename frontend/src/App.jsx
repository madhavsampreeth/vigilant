import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Analyze from './pages/Analyze.jsx';
import Upload from './pages/Upload.jsx';
import Logs from './pages/Logs.jsx';

const App = () => (
  <BrowserRouter>
    <div className="app-shell">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <main className="app-main">
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  </BrowserRouter>
);

export default App;