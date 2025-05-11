import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { adminAPI } from '../../services/api';

/**
 * UserManagement Component
 * 
 * Admin component for managing system users.
 * 
 * Features:
 * - User listing with filtering
 * - User role management
 * - Account activation/deactivation
 * - Password resets
 */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the admin API
      // const response = await adminAPI.getUsers();
      // setUsers(response.data);
      
      // Simulate API call for demo
      setTimeout(() => {
        setUsers([
          {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'interviewer',
            status: 'active',
            lastLogin: '2025-04-28T14:30:00Z'
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-05-01T09:15:00Z'
          },
          {
            id: 3,
            name: 'Robert Lee',
            email: 'robert.lee@example.com',
            role: 'interviewer',
            status: 'inactive',
            lastLogin: '2025-03-15T11:45:00Z'
          },
          {
            id: 4,
            name: 'Emma Wilson',
            email: 'emma.wilson@example.com',
            role: 'interviewer',
            status: 'active',
            lastLogin: '2025-04-25T16:20:00Z'
          },
          {
            id: 5,
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            role: 'interviewer',
            status: 'pending',
            lastLogin: null
          }
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditClick = (user) => {
    setCurrentUser({ ...user });
    setEditDialogOpen(true);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      // In a real app, this would call the admin API
      // await adminAPI.updateUserStatus(userId, newStatus);
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      setSnackbar({
        open: true,
        message: `User status updated to ${newStatus}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update user status',
        severity: 'error'
      });
    }
  };

  const handleSaveUser = async () => {
    try {
      // In a real app, this would call the admin API
      // await adminAPI.updateUser(currentUser.id, currentUser);
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setUsers(users.map(user => 
        user.id === currentUser.id ? { ...currentUser } : user
      ));
      
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update user',
        severity: 'error'
      });
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      // In a real app, this would call the admin API
      // await adminAPI.resetUserPassword(userId);
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSnackbar({
        open: true,
        message: 'Password reset link sent to user',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to reset password:', error);
      setSnackbar({
        open: true,
        message: 'Failed to reset user password',
        severity: 'error'
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.status.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        User Management
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="contained"
          onClick={() => setSnackbar({
            open: true,
            message: 'New user creation would be implemented here',
            severity: 'info'
          })}
          color="primary"
        >
          Add User
        </Button>
      </Box>
      
      <Card elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={user.role.toUpperCase()} 
                          color={user.role === 'admin' ? 'primary' : 'default'} 
                          variant={user.role === 'admin' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={user.status.toUpperCase()} 
                          color={
                            user.status === 'active' ? 'success' : 
                            user.status === 'pending' ? 'warning' : 'default'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditClick(user)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton 
                          size="small" 
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          sx={{ mr: 1 }}
                          color={user.status === 'active' ? 'default' : 'primary'}
                        >
                          {user.status === 'active' ? (
                            <LockIcon fontSize="small" />
                          ) : (
                            <LockOpenIcon fontSize="small" />
                          )}
                        </IconButton>
                        
                        <IconButton 
                          size="small" 
                          onClick={() => handleResetPassword(user.id)}
                        >
                          <LockIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {currentUser && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Name"
                fullWidth
                margin="dense"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              />
              
              <TextField
                label="Email"
                fullWidth
                margin="dense"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
              
              <FormControl fullWidth margin="dense">
                <InputLabel>Role</InputLabel>
                <Select
                  value={currentUser.role}
                  label="Role"
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="interviewer">Interviewer</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentUser.status}
                  label="Status"
                  onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;