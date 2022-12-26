import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

import ThemeSettings from 'src/components/ThemeSettings';
import Sidebar from './Sidebar';
import Header from './Header';

const CollapsedSidebarLayout = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.Mui-FixedWrapper': {
            '.MuiDrawer-root.MuiDrawer-docked': {
              '.MuiPaper-root': {
                left: 108
              }
            }
          }
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: `${theme.header.height}`,
            [theme.breakpoints.up('md')]: {
              ml: theme.spacing(12)
            }
          }}
        >
          <Box display="block">
            <Outlet />
          </Box>
          <ThemeSettings />
        </Box>
      </Box>
    </>
  );
};

export default CollapsedSidebarLayout;
