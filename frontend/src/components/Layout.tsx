import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ 
        width: '250px', 
        backgroundColor: '#1a237e', 
        color: 'white',
        padding: '20px'
      }}>
        <h2 style={{ marginBottom: '30px' }}>ERP System</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <NavLink 
                to="/" 
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background-color 0.2s'
                })}
              >
                Dashboard
              </NavLink>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <NavLink 
                to="/warehouses" 
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background-color 0.2s'
                })}
              >
                Warehouses
              </NavLink>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <NavLink 
                to="/purchase" 
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background-color 0.2s'
                })}
              >
                Purchase
              </NavLink>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <NavLink 
                to="/sales" 
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background-color 0.2s'
                })}
              >
                Sales
              </NavLink>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <NavLink 
                to="/inventory" 
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background-color 0.2s'
                })}
              >
                Inventory
              </NavLink>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <NavLink 
                to="/settings" 
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background-color 0.2s'
                })}
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;