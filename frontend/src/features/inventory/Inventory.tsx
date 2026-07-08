import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Box, Typography, Paper, Tabs, Tab, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, 
  Select, MenuItem, FormControl, InputLabel, IconButton,
  Accordion, AccordionSummary, AccordionDetails,
  LinearProgress, Alert, AlertTitle
} from '@mui/material';
import { 
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon, ExpandMore 
} from '@mui/icons-material';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: number;
  productId: number;
  warehouseId: number;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  product?: {
    id: number;
    name: string;
    sku: string;
    Category?: { id: number; name: string };
  };
  warehouse?: {
    id: number;
    name: string;
    code: string;
  };
}

interface StockTransaction {
  id: number;
  productId: number;
  warehouseId: number;
  transactionType: string;
  quantity: number;
  referenceNumber?: string;
  notes?: string;
  transactionDate: string;
  product?: { id: number; name: string; sku: string };
}

const Inventory = () => {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | StockTransaction | null>(null);
  const [formData, setFormData] = useState({
    productId: 0, productName: '', productSku: '', categoryName: '', warehouseId: 0, quantity: 0, minStockLevel: 0, maxStockLevel: 0, reorderPoint: 0,
    transactionType: 'adjustment', referenceNumber: '', notes: '', transactionDate: ''
  });

  // Upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: stock = [], isLoading: stockLoading } = useQuery('inventoryStock', async () => {
    const response = await axios.get('/inventory/stock');
    return response.data;
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery('inventoryTransactions', async () => {
    const response = await axios.get('/inventory/transactions');
    return response.data;
  });

  // Group stock by category
  const groupedStock = React.useMemo(() => {
    const groups: { [key: string]: InventoryItem[] } = {};
    stock.forEach((item: InventoryItem) => {
      const categoryName = item.product?.Category?.name || 'Uncategorized';
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [stock]);

  // @ts-ignore
  const createMutation: any = useMutation(
    async (data: any) => {
      const response = tabValue === 0 ? await axios.post('/inventory/stock', data) : await axios.post('/inventory/adjust', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'inventoryStock' : 'inventoryTransactions');
        setOpen(false);
        resetForm();
        toast.success(`${tabValue === 0 ? 'Stock item' : 'Transaction'} created successfully`);
      },
      onError: () => toast.error(`Failed to create ${tabValue === 0 ? 'stock item' : 'transaction'}`),
    }
  );

  // @ts-ignore
  const deleteMutation: any = useMutation(
    async (id: number) => {
      const response = tabValue === 0 ? await axios.delete(`/inventory/stock/${id}`) : await axios.delete(`/inventory/transactions/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'inventoryStock' : 'inventoryTransactions');
        toast.success(`${tabValue === 0 ? 'Stock item' : 'Transaction'} deleted successfully`);
      },
      onError: () => toast.error(`Failed to delete ${tabValue === 0 ? 'stock item' : 'transaction'}`),
    }
  );

  const resetForm = () => {
    setFormData({
      productId: 0, productName: '', productSku: '', categoryName: '', warehouseId: 0, quantity: 0, minStockLevel: 0, maxStockLevel: 0, reorderPoint: 0,
      transactionType: 'adjustment', referenceNumber: '', notes: '', transactionDate: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // @ts-ignore
      updateMutation.mutate({ data: formData, id: editingItem.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Inventory Management</Typography>
      
      <Paper elevation={3} style={{ marginBottom: '20px' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Stock Overview" />
          <Tab label="Stock Transactions" />
        </Tabs>
      </Paper>

      <Box style={{ marginBottom: '20px', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => { setUploadOpen(true); setUploadResult(null); setSelectedFile(null); }}
        >
          Import Excel
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => { setEditingItem(null); resetForm(); setOpen(true); }}
        >
          Add {tabValue === 0 ? 'Stock Item' : 'Transaction'}
        </Button>
      </Box>

      {tabValue === 0 ? (
        <Box>
          {stockLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            groupedStock.map(([category, items]) => (
              <Accordion key={category} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {category} 
                    <Typography component="span" variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      ({items.length} items)
                    </Typography>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper elevation={1}>
                    <Box style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Product</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>SKU</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Warehouse</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Quantity</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Available</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item: InventoryItem) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '12px' }}>{item.id}</td>
                              <td style={{ padding: '12px', fontWeight: 500 }}>{item.product?.name || `Product #${item.productId}`}</td>
                              <td style={{ padding: '12px' }}>{item.product?.sku || '-'}</td>
                              <td style={{ padding: '12px' }}>{item.warehouse?.name || `WH #${item.warehouseId}`}</td>
                              <td style={{ padding: '12px' }}>{item.quantity}</td>
                              <td style={{ padding: '12px' }}>{item.availableQuantity ?? item.quantity}</td>
                              <td style={{ padding: '12px' }}>
                                <IconButton onClick={() => deleteMutation.mutate(item.id)} size="small" color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            ))
          )}
          {!stockLoading && groupedStock.length === 0 && (
            <Paper elevation={3} style={{ padding: '40px', textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">No inventory items found</Typography>
              <Typography variant="body2" color="textSecondary">Add stock items or import from Excel</Typography>
            </Paper>
          )}
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box style={{ padding: '20px' }}>
            {transactionsLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Product</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Warehouse ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Type</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Quantity</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Reference</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn: StockTransaction) => (
                      <tr key={txn.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{txn.id}</td>
                        <td style={{ padding: '12px' }}>{txn.product?.name || `Product #${txn.productId}`}</td>
                        <td style={{ padding: '12px' }}>{txn.warehouseId}</td>
                        <td style={{ padding: '12px' }}><span style={{ 
                          backgroundColor: txn.transactionType === 'purchase' ? '#e8f5e9' : txn.transactionType === 'sale' ? '#ffebee' : '#fff3e0',
                          padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem'
                        }}>{txn.transactionType}</span></td>
                        <td style={{ padding: '12px' }}>{txn.quantity}</td>
                        <td style={{ padding: '12px' }}>{txn.referenceNumber || '-'}</td>
                        <td style={{ padding: '12px' }}>{txn.transactionDate ? new Date(txn.transactionDate).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '12px' }}>
                          <IconButton onClick={() => deleteMutation.mutate(txn.id)} size="small" color="error">
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit' : 'Add'} {tabValue === 0 ? 'Stock Item' : 'Transaction'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {tabValue === 0 ? (
              <>
                <TextField margin="dense" label="Product Name" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} fullWidth required />
                <TextField margin="dense" label="SKU (optional)" value={formData.productSku} onChange={(e) => setFormData({ ...formData, productSku: e.target.value })} fullWidth />
                <TextField margin="dense" label="Category" value={formData.categoryName} onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })} fullWidth required />
                <TextField margin="dense" label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} fullWidth required />
              </>
            ) : (
              <>
                <TextField margin="dense" label="Product ID" type="number" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: parseInt(e.target.value) })} fullWidth required />
                <TextField margin="dense" label="Warehouse ID" type="number" value={formData.warehouseId} onChange={(e) => setFormData({ ...formData, warehouseId: parseInt(e.target.value) })} fullWidth required />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Transaction Type</InputLabel>
                  <Select value={formData.transactionType} onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })} label="Transaction Type">
                    <MenuItem value="purchase">Purchase</MenuItem>
                    <MenuItem value="sale">Sale</MenuItem>
                    <MenuItem value="adjustment">Adjustment</MenuItem>
                    <MenuItem value="transfer">Transfer</MenuItem>
                  </Select>
                </FormControl>
                <TextField margin="dense" label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} fullWidth required />
                <TextField margin="dense" label="Reference Number" value={formData.referenceNumber} onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })} fullWidth />
                <TextField margin="dense" label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} fullWidth multiline rows={3} />
                <TextField margin="dense" label="Transaction Date" type="date" value={formData.transactionDate} onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })} fullWidth required InputLabelProps={{ shrink: true }} />
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

      {/* Excel Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Inventory from Excel</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Upload an Excel (.xlsx, .xls) or CSV file with inventory data.
            The file should have columns like: Name/SKU (product), Category, Warehouse, Quantity.
          </Typography>

          {uploadResult ? (
            <>
              {(uploadResult.created > 0 || uploadResult.updated > 0) && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <AlertTitle>Import Successful</AlertTitle>
                  {uploadResult.created} new + {uploadResult.updated} updated inventory items
                </Alert>
              )}
              {uploadResult.skipped > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <AlertTitle>Skipped ({uploadResult.skipped})</AlertTitle>
                  {uploadResult.skippedDetails?.map((s: any, i: number) => (
                    <Typography key={i} variant="caption" display="block">
                      Row {s.row}: {s.reason}
                    </Typography>
                  ))}
                </Alert>
              )}
              {uploadResult.errors > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <AlertTitle>Errors ({uploadResult.errors})</AlertTitle>
                  {uploadResult.errorDetails?.map((e: any, i: number) => (
                    <Typography key={i} variant="caption" display="block">
                      Row {e.row}: {e.message}
                    </Typography>
                  ))}
                </Alert>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setUploadOpen(false);
                  setUploadResult(null);
                  setSelectedFile(null);
                  queryClient.invalidateQueries('inventoryStock');
                  queryClient.invalidateQueries('inventoryTransactions');
                }}
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  mb: 2,
                  cursor: 'pointer',
                  backgroundColor: selectedFile ? '#f0f7ff' : '#fafafa',
                  '&:hover': { backgroundColor: '#f0f7ff' }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                  }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {selectedFile ? selectedFile.name : 'Click to select Excel file'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supported formats: .xlsx, .xls, .csv
                </Typography>
              </Box>

              {uploading && <LinearProgress sx={{ mb: 2 }} />}

              <DialogActions sx={{ px: 0 }}>
                <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  disabled={!selectedFile || uploading}
                  onClick={async () => {
                    if (!selectedFile) return;
                    setUploading(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', selectedFile);
                      const response = await axios.post('/inventory/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });
                      setUploadResult(response.data);
                      toast.success(response.data.message);
                    } catch (err: any) {
                      toast.error(err.response?.data?.message || 'Upload failed');
                    } finally {
                      setUploading(false);
                    }
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload & Import'}
                </Button>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;