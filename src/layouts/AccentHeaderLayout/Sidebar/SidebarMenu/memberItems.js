// import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
// import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
// import AddTaskIcon from '@mui/icons-material/AddTask';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ContactsIcon from '@mui/icons-material/Contacts';
import CategoryIcon from '@mui/icons-material/Category';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import ChatIcon from '@mui/icons-material/Chat';

const menuItems = [
  {
    heading: '',
    items: [
      {
        name: 'Categorías y temas',
        icon: CategoryIcon,
        link: '/aim/member/categories-topics'
      },
      {
        name: 'Solicitudes',
        icon: MarkunreadMailboxIcon,
        link: '',
        items: [
          {
            name: 'Solicitudes de Reporte',
            icon: ReportGmailerrorredIcon,
            link: '/aim/member/requests/complaintRequest'
          },
          {
            name: 'Selección de Temas',
            icon: AssignmentTurnedInIcon,
            link: '/aim/member/requests/subjectRequest'
          },
          {
            name: 'Cambio Datos de Perfil',
            icon: ContactsIcon,
            link: '/aim/member/requests/profileRequest'
          }
        ]
      },
      {
        name: 'Asociadas',
        icon: HowToRegIcon,
        link: '/aim/member/associates'
      },
      {
        name: 'Clientes',
        icon: SupervisedUserCircleIcon,
        link: '/aim/member/students'
      },
      {
        name: 'Capacitaciones',
        icon: VideoLibraryIcon,
        link: '/aim/member/capacitations'
      },
      /*
      {
        name: 'Perfil',
        icon: AccountCircleIcon,
        link: '/aim/member/profile'
      },
      */
      {
        name: 'Mensajes',
        icon: ChatIcon,
        link: '/aim/member/chat'
      }
    ]
  }
];

export default menuItems;
