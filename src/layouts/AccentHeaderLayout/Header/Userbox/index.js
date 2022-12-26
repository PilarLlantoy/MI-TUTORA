import { useRef, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  styled
} from '@mui/material';
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { getNameAndUrlFromBack } from 'src/utils/awsConfig';
import { formatNameCapitals } from 'src/utils/training';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(0)};
        color: ${theme.colors.alpha.trueWhite[70]};
        &:hover {
          color: ${theme.colors.alpha.trueWhite[100]};
        }
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
);

const roles = ['Estudiante', 'Miembro AIM', 'Asociada'];

function HeaderUserbox() {
  // const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      navigate('/');
      window.location.replace('https://inf227i4.inf.pucp.edu.pe/');
    } catch (err) {
      console.error(err);
    }
  };

  console.log(user);

  return (
    <Box
      component="span"
      sx={{
        display: { xs: 'none', sm: 'inline-block' }
      }}
    >
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar alt={user.person.fullName} src={user.person.profilePictureURL !== null ? (user.person.role !== 3 && user.person.profilePictureURL.split('#').length > 1 ? getNameAndUrlFromBack(user.person.profilePictureURL).urlS3 : user.person.profilePictureURL) : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'} />
        <ExpandMoreTwoToneIcon
          fontSize="small"
          sx={{
            ml: 0.5
          }}
        />
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex"
        >
          <Avatar
            variant="rounded"
            alt={user.person.fullName}
            src={user.person.profilePictureURL !== null ? (user.person.role !== 3 && user.person.profilePictureURL.split('#').length > 1 ? getNameAndUrlFromBack(user.person.profilePictureURL).urlS3 : user.person.profilePictureURL) : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'}
          />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.person.role === 3 ? 'Administrador' : formatNameCapitals(user.person.fullName).replace(',', '')}</UserBoxLabel>
            {user.person.role !== 3 ? (
              <UserBoxDescription variant="body2">
                {roles[user.person.role]}
              </UserBoxDescription>
            ) :
              <UserBoxDescription variant="body2">
                Sistema AIM
              </UserBoxDescription>
            }
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0
          }}
        />
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          {user.person.role === 2 && (
            <ListItem
              button
              onClick={() => {
                handleClose();
              }}
              to="/aim/associated/profile"
              component={NavLink}
            >
              <AccountBoxTwoToneIcon fontSize="small" />
              <ListItemText primary="Perfil" />
            </ListItem>
          )}
          {user.person.role === 1 && (
            <ListItem
              button
              onClick={() => {
                handleClose();
              }}
              to="/aim/member/chat"
              component={NavLink}
            >
              <InboxTwoToneIcon fontSize="small" />
              <ListItemText primary="Mensajes" />
            </ListItem>
          )}
          {user.person.role === 3 && (
            <>
              <ListItem
                button
                onClick={() => {
                  handleClose();
                }}
                to="/aim/admin/members"
                component={NavLink}
              >
                <AssignmentIndIcon fontSize="small" />
                <ListItemText primary="Miembros" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleClose();
                }}
                to="/aim/admin/associates"
                component={NavLink}
              >
                <HowToRegIcon fontSize="small" />
                <ListItemText primary="Asociadas" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleClose();
                }}
                to="/aim/admin/students"
                component={NavLink}
              >
                <SupervisedUserCircleIcon fontSize="small" />
                <ListItemText primary="Clientes" />
              </ListItem>
            </>
          )}
        </List>
        <Divider />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            Cerrar Sesión
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default HeaderUserbox;