import { Helmet } from 'react-helmet-async';
import { Box, styled, Divider } from '@mui/material';
import Scrollbar from 'src/components/Scrollbar';

import TopBarContent from './TopBarContent';
import BottomBarContent from './BottomBarContent';
import SidebarContent from './SidebarContent';
import ChatContent from './ChatContent';

const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display: flex;
`
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 300px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`
);

export const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(2)};
`
);

function ApplicationsMessenger() {
  return (
    <>
      <Helmet>
        <title>Messenger - Applications</title>
      </Helmet>
      <RootWrapper className="Mui-FixedWrapper">
        <Sidebar>
          <Scrollbar>
            <SidebarContent />
          </Scrollbar>
        </Sidebar>
        <ChatWindow>
          <ChatTopBar>
            <TopBarContent />
          </ChatTopBar>
          <Box flex={1}>
            <Scrollbar>
              <ChatContent />
            </Scrollbar>
          </Box>
          <Divider />
          <BottomBarContent />
        </ChatWindow>
      </RootWrapper>
    </>
  );
}

export default ApplicationsMessenger;
