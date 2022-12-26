import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
// import ThemeSettings from 'src/components/ThemeSettings';
import useAuth from 'src/hooks/useAuth';

import Sidebar from './Sidebar';
import Header from './Header';

const AccentHeaderLayout = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <>
      <Header />
      {user.person.role !== 0 && <Sidebar />}
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          pt: `${theme.header.height}`,
          [theme.breakpoints.up('lg')]: {
            pl: `${user.person.role !== 0 ? theme.sidebar.width : 0}`
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Box flexGrow={1}>
            <Outlet />
          </Box>
        </Box>
        {/*
        <ThemeSettings />
        */}
      </Box>
    </>
  );
};

export default AccentHeaderLayout;
