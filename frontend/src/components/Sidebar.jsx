import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

const navItems = [
  {
    section: 'OVERVIEW',
    links: [{ to: '/', label: 'Dashboard' }]
  },
  {
    section: 'OPERATIONS',
    links: [
      { to: '/upload', label: 'Upload Video' },
      { to: '/analyze', label: 'Analyze Stream' }
    ]
  },
  {
    section: 'INTEL',
    links: [{ to: '/logs', label: 'Activity Logs' }]
  }
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {navItems.map(({ section, links }) => (
        <div key={section}>
          <div className="sidebar-section-label">{section}</div>

          <ul className="sidebar-nav">
            {links.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="sidebar-footer">
        <p>VIGIL.ANT v2.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;