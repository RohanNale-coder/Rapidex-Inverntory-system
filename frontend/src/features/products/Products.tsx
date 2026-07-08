import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, Box, Typography, LinearProgress, Alert, AlertTitle } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  minStockLevel: number;
  categoryId: number;
  brandId?: number;
  unitId: number;
  isActive: boolean;
}

interface DropdownItem {
  id: number;
  name: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get('/products');
  return response.data;
};

const fetchCategories = async (): Promise<DropdownItem[]> => {
  const response = await axios.get('/products/categories');
  return response.data;
};

const fetchBrands = async (): Promise<DropdownItem[]> => {
  const response = await axios.get('/products/brands');
  return response.data;
};

const fetchUnits = async (): Promise<DropdownItem[]> => {
  const response = await axios.get('/products/units');
  return response.data;
};

const Products = () => {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', sku: '', barcode: '', description: '', purchasePrice: 0, sellingPrice: 0, categoryId: 0, brandId: 0, unitId: 0 });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery('products', fetchProducts);
  const { data: categories = [] } = useQuery('categories', fetchCategories);
  const { data: brands = [] } = useQuery('brands', fetchBrands);
  const { data: units = [] } = useQuery('units', fetchUnits);

  // @ts-ignore
  const createMutation: any = useMutation(
    async (newProduct: any) => {
      const response = await axios.post('/products', { ...newProduct, isActive: true });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setOpen(false);
        setFormData({ name: '', sku: '', barcode: '', description: '', purchasePrice: 0, sellingPrice: 0, categoryId: 0, brandId: 0, unitId: 0 });
        toast.success('Product created successfully');
      },
      onError: () => toast.error('Failed to create product'),
    }
  );

  // @ts-ignore
  const updateMutation: any = useMutation(
    async (product: any) => {
      const response = await axios.put(`/products/${product.id}`, product);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setOpen(false);
        setEditingProduct(null);
        toast.success('Product updated successfully');
      },
      onError: () => toast.error('Failed to update product'),
    }
  );

  // @ts-ignore
  const deleteMutation: any = useMutation(
    async (id: number) => {
      const response = await axios.delete(`/products/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
      },
      onError: () => toast.error('Failed to delete product'),
    }
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'sku', headerName: 'SKU', width: 120 },
    { field: 'barcode', headerName: 'Barcode', width: 150 },
    { field: 'purchasePrice', headerName: 'Purchase Price', width: 120, type: 'number' },
    { field: 'sellingPrice', headerName: 'Selling Price', width: 120, type: 'number' },
    { field: 'minStockLevel', headerName: 'Min Stock', width: 100, type: 'number' },
    { field: 'isActive', headerName: 'Active', width: 100, type: 'boolean' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => { setEditingProduct(params.row); setOpen(true); }} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteMutation.mutate(params.row.id)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ ...editingProduct, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku,
        barcode: editingProduct.barcode,
        description: editingProduct.description,
        purchasePrice: editingProduct.purchasePrice,
        sellingPrice: editingProduct.sellingPrice,
        categoryId: editingProduct.categoryId,
        brandId: editingProduct.brandId || 0,
        unitId: editingProduct.unitId,
      });
    }
  }, [editingProduct]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Products</h1>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => { setUploadOpen(true); setUploadResult(null); setSelectedFile(null); }}
          >
            Import Excel
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingProduct(null); setOpen(true); }}>
            Add Product
          </Button>
        </Box>
      </div>

      <div style={{ height: 500, width: '100%', backgroundColor: 'white' }}>
        <DataGrid rows={products} columns={columns} loading={isLoading} pageSizeOptions={[10, 25, 50]} />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              margin="dense"
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Selling Price"
              name="sellingPrice"
              type="number"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
              fullWidth
            />
            <TextField
              margin="dense"
              select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
              fullWidth
              required
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              select
              label="Brand"
              name="brandId"
              value={formData.brandId}
              onChange={(e) => setFormData({ ...formData, brandId: parseInt(e.target.value) })}
              fullWidth
            >
              <MenuItem value={0}>None</MenuItem>
              {brands.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              select
              label="Unit"
              name="unitId"
              value={formData.unitId}
              onChange={(e) => setFormData({ ...formData, unitId: parseInt(e.target.value) })}
              fullWidth
              required
            >
              {units.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Excel Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Products from Excel</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Upload an Excel (.xlsx, .xls) or CSV file with product data.
            The file should have columns like: Name, SKU, Barcode, Category, Brand, Unit, Purchase Price, Selling Price, Min Stock, etc.
          </Typography>

          {uploadResult ? (
            <>
              {uploadResult.created > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <AlertTitle>Import Successful</AlertTitle>
                  {uploadResult.created} products imported successfully
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
                  queryClient.invalidateQueries('products');
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
                      const response = await axios.post('/products/upload', formData, {
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

export default Products;
