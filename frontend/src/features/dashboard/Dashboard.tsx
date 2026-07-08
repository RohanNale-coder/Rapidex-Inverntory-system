import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Box, Typography, Grid, Paper, CircularProgress, Card, CardContent 
} from '@mui/material';
import { 
  TrendingUp, AttachMoney, ShoppingCart, Inventory, 
  People, ShoppingBasket 
} from '@mui/icons-material';

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useQuery('dashboardStats', async () => {
    const response = await axios.get('/dashboard/stats');
    return response.data.stats;
  });

  const isLoading = statsLoading;

  const statCards = [
    {
      title: 'Total Sales',
      value: statsData?.totalSales || 0,
      subtitle: 'Invoices',
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      format: 'number'
    },
    {
      title: 'Total Revenue',
      value: statsData?.totalRevenue || 0,
      subtitle: 'Sales Income',
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      format: 'currency'
    },
    {
      title: 'Total Profit',
      value: statsData?.totalProfit || 0,
      subtitle: 'Revenue - Cost',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      format: 'currency'
    },
    {
      title: 'Total Cost',
      value: statsData?.totalCost || 0,
      subtitle: 'Purchase Cost',
      icon: <ShoppingBasket sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      format: 'currency'
    },
    {
      title: 'Total Products',
      value: statsData?.totalProducts || 0,
      subtitle: 'Active Products',
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      format: 'number'
    },
    {
      title: 'Total Customers',
      value: statsData?.totalCustomers || 0,
      subtitle: 'Active Customers',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#00796b',
      format: 'number'
    }
  ];

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString('en-IN');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard
      </Typography>
      
      {isLoading ? (
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={3} 
                sx={{ 
                  backgroundColor: card.color, 
                  color: 'white',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {formatValue(card.value, card.format)}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {card.subtitle}
                      </Typography>
                    </Box>
                    <Box sx={{ opacity: 0.8 }}>
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Dashboard;