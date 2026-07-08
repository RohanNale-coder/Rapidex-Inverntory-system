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

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  isActive: boolean;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string;
}

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | Role | null>(null);
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', roleId: 0, password: '', isActive: true,
    name: '', description: '', permissions: ''
  });
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading } = useQuery('users', async () => {
    const response = await axios.get('/users');
    return response.data;
  });

  const { data: roles = [], isLoading: rolesLoading } = useQuery('roles', async () => {
    const response = await axios.get('/users/roles');
    return response.data;
  });

  // @ts-ignore
  const createMutation: any = useMutation(
    async (data: any) => {
      const response = tabValue === 0 ? await axios.post('/users', data) : await axios.post('/users/roles', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'users' : 'roles');
        setOpen(false);
        resetForm();
        toast.success(`${tabValue === 0 ? 'User' : 'Role'} created successfully`);
      },
      onError: () => toast.error(`Failed to create ${tabValue === 0 ? 'user' : 'role'}`),
    }
  );

  // @ts-ignore
  const updateMutation: any = useMutation(
    async ({ data, id }: { data: any; id: number }) => {
      const response = tabValue === 0 ? await axios.put(`/users/${id}`, data) : await axios.put(`/users/roles/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'users' : 'roles');
        setOpen(false);
        setEditingItem(null);
        resetForm();
        toast.success(`${tabValue === 0 ? 'User' : 'Role'} updated successfully`);
      },
      onError: () => toast.error(`Failed to update ${tabValue === 0 ? 'user' : 'role'}`),
    }
  );

  // @ts-ignore
  const deleteMutation: any = useMutation(
    async (id: number) => {
      const response = tabValue === 0 ? await axios.delete(`/users/${id}`) : await axios.delete(`/users/roles/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tabValue === 0 ? 'users' : 'roles');
        toast.success(`${tabValue === 0 ? 'User' : 'Role'} deleted successfully`);
      },
      onError: () => toast.error(`Failed to delete ${tabValue === 0 ? 'user' : 'role'}`),
    }
  );

  const resetForm = () => {
    setFormData({
      email: '', firstName: '', lastName: '', roleId: 0, password: '', isActive: true,
      name: '', description: '', permissions: ''
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

  const handleEdit = (item: User | Role) => {
    setEditingItem(item);
    const isUser = tabValue === 0;
    setFormData({
      email: isUser ? (item as User).email : '',
      firstName: isUser ? (item as User).firstName : '',
      lastName: isUser ? (item as User).lastName : '',
      roleId: isUser ? (item as User).roleId : 0,
      password: '',
      isActive: isUser ? (item as User).isActive : true,
      name: !isUser ? (item as Role).name : '',
      description: !isUser ? (item as Role).description : '',
      permissions: !isUser ? (item as Role).permissions || '' : ''
    });
    setOpen(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      <Paper elevation={3} style={{ marginBottom: '20px' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Users" />
          <Tab label="Roles" />
        </Tabs>
      </Paper>

      <Box style={{ marginBottom: '20px' }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => { setEditingItem(null); resetForm(); setOpen(true); }}
        >
          Add {tabValue === 0 ? 'User' : 'Role'}
        </Button>
      </Box>

      {tabValue === 0 ? (
        <Paper elevation={3}>
          <Box style={{ padding: '20px' }}>
            {usersLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>First Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Last Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: User) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{user.id}</td>
                        <td style={{ padding: '12px' }}>{user.email}</td>
                        <td style={{ padding: '12px' }}>{user.firstName}</td>
                        <td style={{ padding: '12px' }}>{user.lastName}</td>
                        <td style={{ padding: '12px' }}>{user.roleId}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: user.isActive ? '#4caf50' : '#f44336',
                            color: 'white',
                            fontSize: '12px'
                          }}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <IconButton onClick={() => handleEdit(user)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteMutation.mutate(user.id)} size="small" color="error">
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
            {rolesLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Permissions</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role: Role) => (
                      <tr key={role.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{role.id}</td>
                        <td style={{ padding: '12px' }}>{role.name}</td>
                        <td style={{ padding: '12px' }}>{role.description}</td>
                        <td style={{ padding: '12px' }}>{role.permissions}</td>
                        <td style={{ padding: '12px' }}>
                          <IconButton onClick={() => handleEdit(role)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteMutation.mutate(role.id)} size="small" color="error">
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
        <DialogTitle>{editingItem ? 'Edit' : 'Add'} {tabValue === 0 ? 'User' : 'Role'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {tabValue === 0 ? (
              <>
                <TextField margin="dense" label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} fullWidth required />
                <TextField margin="dense" label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} fullWidth required />
                <TextField margin="dense" label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} fullWidth required />
                <TextField margin="dense" label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} fullWidth required={!editingItem} />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Role</InputLabel>
                  <Select value={formData.roleId.toString()} onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })} label="Role">
                    {roles.map((role: Role) => (
                      <MenuItem key={role.id} value={role.id.toString()}>{role.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Status</InputLabel>
                  <Select value={formData.isActive.toString()} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} label="Status">
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <TextField margin="dense" label="Role Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth required />
                <TextField margin="dense" label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth multiline rows={3} />
                <TextField margin="dense" label="Permissions" value={formData.permissions} onChange={(e) => setFormData({ ...formData, permissions: e.target.value })} fullWidth multiline rows={3} />
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

export default Settings;
