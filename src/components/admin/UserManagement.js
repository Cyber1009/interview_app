import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Switch,
  FormControlLabel,
  Snackbar,
  Grid
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import AdminService from '../../services/adminService';
import { alpha, useTheme } from '@mui/material/styles';

// Create context to share user data with other components
export const UserDataContext = createContext({
  users: [],
  totalUsers: 0,
  activeUsers: 0,
  isLoading: true,
  error: null
});

// Export a custom hook to easily access the user data
export const useUserData = () => useContext(UserDataContext);

export const UserManagement = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // States for edit user dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const theme = useTheme();

  // Calculate user stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.is_active && user.subscription_status === "active").length;

  // Make user data available to parent components through ref
  useEffect(() => {
    // Update global user data context if needed
    if (window._adminUserData) {
      window._adminUserData.totalUsers = totalUsers;
      window._adminUserData.activeUsers = activeUsers;
      window._adminUserData.users = users;
      window._adminUserData.isLoading = loading;
    } else {
      window._adminUserData = { totalUsers, activeUsers, users, isLoading: loading };
    }
  }, [users, totalUsers, activeUsers, loading]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply search filter when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.username?.toLowerCase().includes(lowercaseSearch) ||
        user.email?.toLowerCase().includes(lowercaseSearch) ||
        user.company?.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAllUsers();
      // The response structure might vary based on your API
      const userData = response?.data || [];
      setUsers(userData);
      setFilteredUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load user data. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development (remove in production)
  useEffect(() => {
    if (loading && process.env.NODE_ENV === 'development') {
      const mockUsers = [
        {
          id: 1,
          username: 'johndoe',
          email: 'john@example.com',
          company: 'Acme Inc',
          is_active: true,
          subscription_status: 'active',
          subscription_plan: 'premium',
          subscription_end_date: '2025-12-31',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          username: 'janedoe',
          email: 'jane@example.com',
          company: 'XYZ Corp',
          is_active: true,
          subscription_status: 'trial',
          subscription_plan: 'basic',
          subscription_end_date: '2025-06-15',
          created_at: '2024-02-20'
        },
        {
          id: 3,
          username: 'bobsmith',
          email: 'bob@example.com',
          company: 'Tech Solutions',
          is_active: false,
          subscription_status: 'expired',
          subscription_plan: 'basic',
          subscription_end_date: '2025-03-01',
          created_at: '2024-01-05'
        },
        {
          id: 4,
          username: 'alicegreen',
          email: 'alice@example.com',
          company: 'Green Innovations',
          is_active: true,
          subscription_status: 'active',
          subscription_plan: 'enterprise',
          subscription_end_date: '2026-01-01',
          created_at: '2024-03-10'
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }
  }, [loading]);

  // Rest of the component remains the same
  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status, isActive) => {
    if (!isActive) return 'error';
    
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'trial':
        return 'info';
      case 'expired':
        return 'warning';
      case 'suspended':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    setIsSubmitting(true);
    try {
      // Create a new object with only the fields that are allowed to be updated
      const userData = {
        email: editingUser.email,
        company: editingUser.company,
        is_active: editingUser.is_active,
        subscription_plan: editingUser.subscription_plan,
        subscription_status: editingUser.subscription_status
      };
      
      // Format subscription end date with time component if needed
      if (editingUser.subscription_end_date) {
        // Make sure we're using a simple ISO format without timezone information
        // to avoid timezone comparison issues in the backend
        const dateOnly = editingUser.subscription_end_date.split('T')[0];
        // Add a specific time to make it consistent (end of day)
        userData.subscription_end_date = `${dateOnly}T23:59:59`;
      }
      
      await AdminService.updateUser(editingUser.id, userData);
      
      // Update local state with the edited user
      const updatedUsers = users.map(u => 
        u.id === editingUser.id ? {...u, ...userData} : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user => {
        if (!searchTerm) return true;
        const lowercaseSearch = searchTerm.toLowerCase();
        return (
          user.username?.toLowerCase().includes(lowercaseSearch) ||
          user.email?.toLowerCase().includes(lowercaseSearch) ||
          user.company?.toLowerCase().includes(lowercaseSearch)
        );
      }));
      
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to update user',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LinearProgress sx={{ width: '100%', my: 3 }} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      {filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            No users found matching your search criteria
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: user.is_active ? 'primary.main' : 'grey.500' }}>
                        {user.username?.[0]?.toUpperCase() || <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.company || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.is_active 
                        ? user.subscription_status?.charAt(0).toUpperCase() + user.subscription_status?.slice(1) || 'Unknown' 
                        : 'Inactive'
                      }
                      size="small"
                      color={getStatusColor(user.subscription_status, user.is_active)}
                    />
                  </TableCell>
                  <TableCell>
                    {user.subscription_plan 
                      ? user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1) 
                      : 'None'
                    }
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, user)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          setEditingUser(selectedUser);
          setEditDialogOpen(true);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit User
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          Edit User
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                value={editingUser?.username || ''}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={editingUser?.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company"
                fullWidth
                value={editingUser?.company || ''}
                onChange={(e) => setEditingUser({ ...editingUser, company: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Subscription Plan</InputLabel>
                <Select
                  label="Subscription Plan"
                  value={editingUser?.subscription_plan || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, subscription_plan: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subscription End Date"
                type="date"
                fullWidth
                value={editingUser?.subscription_end_date ? editingUser.subscription_end_date.split('T')[0] : ''}
                onChange={(e) => setEditingUser({ ...editingUser, subscription_end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingUser?.is_active || false}
                    onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                    color="primary"
                  />
                }
                label="Account Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            variant="outlined"
            sx={{ 
              color: theme.palette.info.main,
              borderColor: theme.palette.info.main,
              '&:hover': {
                borderColor: theme.palette.info.main,
                bgcolor: alpha(theme.palette.info.main, 0.05)
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateUser}
            disabled={isSubmitting}
            startIcon={isSubmitting ? null : <SaveIcon />}
            sx={{ 
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.9)
              }
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbar({ ...snackbar, open: false })}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

// Create a component that exports user stats through context
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    users: [],
    totalUsers: 0,
    activeUsers: 0,
    isLoading: true,
    error: null
  });

  // Use interval to check for updated user data
  useEffect(() => {
    const updateFromGlobal = () => {
      if (window._adminUserData) {
        setUserData({
          users: window._adminUserData.users || [],
          totalUsers: window._adminUserData.totalUsers || 0,
          activeUsers: window._adminUserData.activeUsers || 0,
          isLoading: window._adminUserData.isLoading || false,
          error: null
        });
      }
    };

    // Initial update
    updateFromGlobal();
    
    // Set up periodic updates
    const intervalId = setInterval(updateFromGlobal, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserManagement;