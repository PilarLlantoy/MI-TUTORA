import { useEffect } from 'react';

import PropTypes from 'prop-types';
import {
  Box,
  List,
  Button,
  alpha,
  styled,
  useTheme,
  Drawer
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Scrollbar from 'src/components/Scrollbar';
import { useSelector, useDispatch } from 'src/store';
import { closeSidebar } from 'src/slices/mailbox';
import SidebarItem from './SidebarItem';

const DrawerWrapper = styled(Drawer)(
  ({ theme }) => `
    width: 280px;
    flex-shrink: 0;
    z-index: 3;
    position: relative;

    & > .MuiPaper-root {
        width: 280px;
        height: calc(100% - ${theme.header.height});
        position: fixed;
        top: ${theme.header.height};
        left: ${theme.sidebar.width};
        z-index: 3;
        background: ${alpha(theme.colors.alpha.white[100], 0.1)};
    }
`
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 280px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 280px;
        z-index: 3;
  }
`
);

const ListItemWrapper = styled(SidebarItem)(
  ({ theme }) => `

    padding: ${theme.spacing(1)};

    .MuiTypography-root {
      font-size: ${theme.typography.pxToRem(13)};
      color: ${theme.colors.alpha.black[100]};
    }

    .MuiListItemIcon-root {
      color: ${theme.colors.primary.main};
      min-width: 34px;
    }

    .MuiTouchRipple-root {
      display: none;
    }

    &.Mui-selected {
      background-color: ${theme.colors.alpha.white[100]} !important;
    }

    &:hover {
      background-color: ${theme.colors.alpha.white[70]};
    }
`
);

const MailboxSidebar = () => {
  const { tags, sidebarOpen } = useSelector((state) => state.mailbox);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    if (sidebarOpen) {
      dispatch(closeSidebar());
    }
  }, [location.pathname]);

  const closeSidebarClick = () => {
    dispatch(closeSidebar());
  };

  const sidebarContent = (
    <Box p={3}>
      <Button fullWidth variant="contained">
        {t('Compose message')}
      </Button>
      <List
        sx={{
          mt: 3,
          p: 0
        }}
        component="div"
      >
        {tags.map((tag) => (
          <ListItemWrapper key={tag.id} tag={tag} />
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <DrawerWrapperMobile
        sx={{
          display: { lg: 'none', xs: 'inline-block' }
        }}
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        onClose={closeSidebarClick}
        open={sidebarOpen}
      >
        <Scrollbar>{sidebarContent}</Scrollbar>
      </DrawerWrapperMobile>
      <DrawerWrapper
        sx={{
          display: { xs: 'none', lg: 'block' }
        }}
        variant="permanent"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open
      >
        <Scrollbar>{sidebarContent}</Scrollbar>
      </DrawerWrapper>
    </>
  );
};

MailboxSidebar.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  containerRef: PropTypes.any.isRequired
};

export default MailboxSidebar;
