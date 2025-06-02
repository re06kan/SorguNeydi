import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <StorageIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SorguNeydi
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Ana Sayfa
          </Button>
          <Button color="inherit" component={RouterLink} to="/connections">
            Bağlantılar
          </Button>
          <Button color="inherit" component={RouterLink} to="/query">
            Sorgu
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
