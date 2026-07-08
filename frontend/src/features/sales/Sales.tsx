import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Box, Typography, Paper, Tabs, Tab, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, 
  Select, MenuItem, FormControl, InputLabel, IconButton 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface SalesOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  warehouseId: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: string;
  totalAmount: number;
  notes?: string;
}

interface SalesInvoice {
  id: number;
  invoiceNumber: string;
  salesOrderId: number;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: string;
}

const Sales = () => {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SalesOrder | SalesInvoice | null>(null);
  const [formData, setFormData] = useState({
    orderNumber: '', customerId: 0, warehouseId: 0, orderDate: '', 
    expectedDeliveryDate: '', status: 'pending', totalAmount: 0, notes: '',
    invoiceNumber: '', salesOrderId: 0, invoiceDate: '', dueDate: '', 
    amount: 0, paidAmount: 0
  });
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: ordersLoading } = useQuery('salesOrders', async () => {
    const response = await axios.get('/sales/orders');
    return response.data;
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery('salesInvoices', async () => {
    const response = await axios.get('/sales/invoices');
    return response.data;
  });

  // @ts-ignore
  const createMutation: any = useMutation(
    async (data: any) => {
      const response = tabValue === 0 ? await axios.post('/sales/orders', data) : await axios.post('/sales/invoices', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'salesOrders' : 'salesInvoices');
        setOpen(false);
        resetForm();
        toast.success(`${tabValue === 0 ? 'Order' : 'Invoice'} created successfully`);
      },
      onError: () => toast.error(`Failed to create ${tabValue === 0 ? 'order' : 'invoice'}`),
    }
  );

  // @ts-ignore
  const updateMutation: any = useMutation(
    async ({ data, id }: { data: any; id: number }) => {
      const response = tabValue === 0 ? await axios.put(`/sales/orders/${id}`, data) : await axios.put(`/sales/invoices/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'salesOrders' : 'salesInvoices');
        setOpen(false);
        setEditingItem(null);
        resetForm();
        toast.success(`${tabValue === 0 ? 'Order' : 'Invoice'} updated successfully`);
      },
      onError: () => toast.error(`Failed to update ${tabValue === 0 ? 'order' : 'invoice'}`),
    }
  );

  // @ts-ignore
  const deleteMutation: any = useMutation(
    async (id: number) => {
      const response = tabValue === 0 ? await axios.delete(`/sales/orders/${id}`) : await axios.delete(`/sales/invoices/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'salesOrders' : 'salesInvoices');
        toast.success(`${tabValue === 0 ? 'Order' : 'Invoice'} deleted successfully`);
      },
      onError: () => toast.error(`Failed to delete ${tabValue === 0 ? 'order' : 'invoice'}`),
    }
  );

  const resetForm = () => {
    setFormData({
      orderNumber: '', customerId: 0, warehouseId: 0, orderDate: '', 
      expectedDeliveryDate: '', status: 'pending', totalAmount: 0, notes: '',
      invoiceNumber: '', salesOrderId: 0, invoiceDate: '', dueDate: '', 
      amount: 0, paidAmount: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ data: formData, id: editingItem.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: SalesOrder | SalesInvoice) => {
    setEditingItem(item);
    const isOrder = tabValue === 0;
    setFormData({
      orderNumber: isOrder ? (item as SalesOrder).orderNumber : '',
      customerId: isOrder ? (item as SalesOrder).customerId : 0,
      warehouseId: isOrder ? (item as SalesOrder).warehouseId : 0,
      orderDate: isOrder ? (item as SalesOrder).orderDate : '',
      expectedDeliveryDate: isOrder ? (item as SalesOrder).expectedDeliveryDate : '',
      status: item.status || 'pending',
      totalAmount: isOrder ? (item as SalesOrder).totalAmount : (item as SalesInvoice).amount || 0,
      notes: isOrder ? (item as SalesOrder).notes || '' : '',
      invoiceNumber: !isOrder ? (item as SalesInvoice).invoiceNumber : '',
      salesOrderId: !isOrder ? (item as SalesInvoice).salesOrderId : 0,
      invoiceDate: !isOrder ? (item as SalesInvoice).invoiceDate : '',
      dueDate: !isOrder ? (item as SalesInvoice).dueDate : '',
      amount: !isOrder ? (item as SalesInvoice).amount || 0 : 0,
      paidAmount: !isOrder ? (item as SalesInvoice).paidAmount || 0 : 0
    });
    setOpen(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Sales Management</Typography>
      
      <Paper elevation={3} style={{ marginBottom: '20px' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Sales Orders" />
          <Tab label="Sales Invoices" />
        </Tabs>
      </Paper>

      <Box style={{ marginBottom: '20px' }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => { setEditingItem(null); resetForm(); setOpen(true); }}
        >
          Add {tabValue === 0 ? 'Order' : 'Invoice'}
        </Button>
      </Box>

      {tabValue === 0 ? (
        <Paper elevation={3}>
          <Box style={{ padding: '20px' }}>
            {ordersLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Order #</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Customer</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Warehouse</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Order Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Expected Delivery</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Total Amount</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: SalesOrder) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{order.orderNumber}</td>
                        <td style={{ padding: '12px' }}>{order.customerId}</td>
                        <td style={{ padding: '12px' }}>{order.warehouseId}</td>
                        <td style={{ padding: '12px' }}>{order.orderDate}</td>
                        <td style={{ padding: '12px' }}>{order.expectedDeliveryDate}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: order.status === 'completed' ? '#4caf50' : order.status === 'pending' ? '#ff9800' : '#f44336',
                            color: 'white',
                            fontSize: '12px'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>₹{order.totalAmount}</td>
                        <td style={{ padding: '12px' }}>
                          <IconButton onClick={() => handleEdit(order)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteMutation.mutate(order.id)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </Box>
        </Paper>
      ) : (
        <Paper elevation={3}>
          <Box style={{ padding: '20px' }}>
            {invoicesLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Invoice #</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Order ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Invoice Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Due Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Amount</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Paid</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice: SalesInvoice) => (
                      <tr key={invoice.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{invoice.invoiceNumber}</td>
                        <td style={{ padding: '12px' }}>{invoice.salesOrderId}</td>
                        <td style={{ padding: '12px' }}>{invoice.invoiceDate}</td>
                        <td style={{ padding: '12px' }}>{invoice.dueDate}</td>
                        <td style={{ padding: '12px' }}>₹{invoice.amount}</td>
                        <td style={{ padding: '12px' }}>₹{invoice.paidAmount}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: invoice.status === 'paid' ? '#4caf50' : invoice.status === 'partial' ? '#ff9800' : '#f44336',
                            color: 'white',
                            fontSize: '12px'
                          }}>
                            {invoice.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <IconButton onClick={() => handleEdit(invoice)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteMutation.mutate(invoice.id)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit' : 'Add'} {tabValue === 0 ? 'Sales Order' : 'Sales Invoice'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {tabValue === 0 ? (
              <>
                <TextField margin="dense" label="Order Number" value={formData.orderNumber} onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })} fullWidth required />
                <TextField margin="dense" label="Customer ID" type="number" value={formData.customerId} onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })} fullWidth required />
                <TextField margin="dense" label="Warehouse ID" type="number" value={formData.warehouseId} onChange={(e) => setFormData({ ...formData, warehouseId: parseInt(e.target.value) })} fullWidth required />
                <TextField margin="dense" label="Order Date" type="date" value={formData.orderDate} onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })} fullWidth required InputLabelProps={{ shrink: true }} />
                <TextField margin="dense" label="Expected Delivery Date" type="date" value={formData.expectedDeliveryDate} onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })} fullWidth required InputLabelProps={{ shrink: true }} />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Status</InputLabel>
                  <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} label="Status">
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <TextField margin="dense" label="Total Amount" type="number" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })} fullWidth required />
                <TextField margin="dense" label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} fullWidth multiline rows={3} />
              </>
            ) : (
              <>
                <TextField margin="dense" label="Invoice Number" value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} fullWidth required />
                <TextField margin="dense" label="Sales Order ID" type="number" value={formData.salesOrderId} onChange={(e) => setFormData({ ...formData, salesOrderId: parseInt(e.target.value) })} fullWidth required />
                <TextField margin="dense" label="Invoice Date" type="date" value={formData.invoiceDate} onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })} fullWidth required InputLabelProps={{ shrink: true }} />
                <TextField margin="dense" label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} fullWidth required InputLabelProps={{ shrink: true }} />
                <TextField margin="dense" label="Amount" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} fullWidth required />
                <TextField margin="dense" label="Paid Amount" type="number" value={formData.paidAmount} onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) })} fullWidth required />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Status</InputLabel>
                  <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} label="Status">
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Sales;
