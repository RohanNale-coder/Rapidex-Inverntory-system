import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface Warehouse {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  isActive: boolean;
}

const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const response = await axios.get('/warehouses');
  return response.data;
};

const Warehouses = () => {
  const [open, setOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', address: '', city: '', phone: '' });
  const queryClient = useQueryClient();

  const { data: warehouses = [], isLoading } = useQuery('warehouses', fetchWarehouses);

  // @ts-ignore
  const createMutation: any = useMutation(
    async (newWarehouse: any) => {
      const response = await axios.post('/warehouses', { ...newWarehouse, companyId: 1, isActive: true });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('warehouses');
        setOpen(false);
        setFormData({ name: '', code: '', address: '', city: '', phone: '' });
        toast.success('Warehouse created successfully');
      },
      onError: () => toast.error('Failed to create warehouse'),
    }
  );

  // @ts-ignore
  const updateMutation: any = useMutation(
    async (wh: any) => {
      const response = await axios.put(`/warehouses/${wh.id}`, wh);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('warehouses');
        setOpen(false);
        setEditingWarehouse(null);
        toast.success('Warehouse updated successfully');
      },
      onError: () => toast.error('Failed to update warehouse'),
    }
  );

  // @ts-ignore
  const deleteMutation: any = useMutation(
    async (id: number) => {
      const response = await axios.delete(`/warehouses/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('warehouses');
        toast.success('Warehouse deleted successfully');
      },
      onError: () => toast.error('Failed to delete warehouse'),
    }
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'code', headerName: 'Code', width: 120 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      type: 'boolean',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => { setEditingWarehouse(params.row); setOpen(true); }} size="small">
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
    if (editingWarehouse) {
      updateMutation.mutate({ ...editingWarehouse, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  React.useEffect(() => {
    if (editingWarehouse) {
      setFormData({
        name: editingWarehouse.name,
        code: editingWarehouse.code,
        address: editingWarehouse.address,
        city: editingWarehouse.city,
        phone: editingWarehouse.phone,
      });
    }
  }, [editingWarehouse]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Warehouses</h1>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingWarehouse(null); setOpen(true); }}>
          Add Warehouse
        </Button>
      </div>

      <div style={{ height: 500, width: '100%', backgroundColor: 'white' }}>
        <DataGrid rows={warehouses} columns={columns} loading={isLoading} pageSizeOptions={[10, 25, 50]} />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth required />
            <TextField margin="dense" label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} fullWidth required />
            <TextField margin="dense" label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} fullWidth multiline />
            <TextField margin="dense" label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} fullWidth />
            <TextField margin="dense" label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingWarehouse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Warehouses;