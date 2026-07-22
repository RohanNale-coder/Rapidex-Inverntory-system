import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import './Dashboard.css';

const Dashboard = () => {
  const { theme } = useTheme();
  
  const { data: statsData, isLoading: statsLoading } = useQuery('dashboardStats', async () => {
    const response = await axios.get('/dashboard/stats');
    return response.data.stats;
  });

  const statCards = [
    {
      title: 'Total Sales',
      value: statsData?.totalSales || 0,
      subtitle: 'Invoices',
      icon: 'shopping-cart',
      color: '#2563eb',
      format: 'number'
    },
    {
      title: 'Revenue',
      value: statsData?.totalRevenue || 0,
      subtitle: 'Sales Income',
      icon: 'dollar-sign',
      color: '#16a34a',
      format: 'currency'
    },
    {
      title: 'Profit',
      value: statsData?.totalProfit || 0,
      subtitle: 'Revenue - Cost',
      icon: 'trending-up',
      color: '#f59e0b',
      format: 'currency'
    },
    {
      title: 'Cost',
      value: statsData?.totalCost || 0,
      subtitle: 'Purchase Cost',
      icon: 'package',
      color: '#dc2626',
      format: 'currency'
    },
    {
      title: 'Products',
      value: statsData?.totalProducts || 0,
      subtitle: 'Active Products',
      icon: 'box',
      color: '#a855f7',
      format: 'number'
    },
    {
      title: 'Customers',
      value: statsData?.totalCustomers || 0,
      subtitle: 'Active Customers',
      icon: 'users',
      color: '#0891b2',
      format: 'number'
    }
  ];

  const getIcon = (name: string) => {
    const icons: Record<string, JSX.Element> = {
      'shopping-cart': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
      'dollar-sign': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      'trending-up': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ),
      'package': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      ),
      'box': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      'users': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    };
    return icons[name] || null;
  };

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString('en-IN');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's an overview of your business.</p>
      </div>

      {statsLoading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {statCards.map((card, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-header">
                <div className="stat-icon-container" style={{ '--icon-color': card.color } as any}>
                  {getIcon(card.icon)}
                </div>
                <div className="stat-info">
                  <p className="stat-title">{card.title}</p>
                  <p className="stat-subtitle">{card.subtitle}</p>
                </div>
              </div>
              <div className="stat-value">
                {formatValue(card.value, card.format)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;