import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';

const Layout = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SorguNeydi
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/connections"
            startIcon={<StorageIcon />}
          >
            Bağlantılar
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/query"
            startIcon={<CodeIcon />}
          >
            SQL Sorgu
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 1, sm: 2 },
          py: 2
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
