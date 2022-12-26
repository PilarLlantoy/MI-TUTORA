import { Box, Button, IconButton } from '@mui/material';
// import HeaderNotifications from './Notifications';
// import LanguageSwitcher from './LanguageSwitcher';

import ClassIcon from '@mui/icons-material/Class';
import ChatIcon from '@mui/icons-material/Chat';

function HeaderButtons() {
  return (
    <Box
      sx={{
        mr: 1
      }}
    >
      <Button
        startIcon={<ClassIcon size="1rem" />}
        variant="outlined"
        color="white"
        href="/aim/student/classes"
        style={{
          marginRight: '15px'
        }}
      >
        Mis Clases
      </Button>
      <Button
        startIcon={<ClassIcon size="1rem" />}
        variant="outlined"
        color="white"
        href="/aim/student/reservations"
        style={{
          marginRight: '15px'
        }}
      >
        Mis Reservas
      </Button>
      <IconButton href="/aim/student/chat">
        <ChatIcon color="white" />
      </IconButton>
    </Box>
  );
}

export default HeaderButtons;