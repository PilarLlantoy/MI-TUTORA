// import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
/*
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ContactsIcon from '@mui/icons-material/Contacts';

*/
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
// import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
// import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
// import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
// import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';

const menuItems = [
  {
    heading: '',
    items: [
      {
        name: 'Mis Clases',
        icon: BackupTableTwoToneIcon,
        link: '/aim/associated/classes'
      },
      {
        name: 'Mis Solicitudes',
        icon: MarkunreadMailboxIcon,
        link: '/aim/associated/requests'
      },
      {
        name: 'Reservas',
        icon: ListAltIcon,
        link: '/aim/associated/reservations'
      },
      {
        name: 'Mis Cursos',
        icon: ImportContactsIcon,
        link: '/aim/associated/courses'
      },
      {
        name: 'Capacitaciones',
        icon: LocalLibraryIcon,
        link: '/aim/associated/capacitations'
      },
      {
        name: 'Disponibilidad',
        icon: CalendarTodayIcon,
        link: '/aim/associated/disponibility'
      },
      {
        name: 'Perfil',
        icon: AccountCircleIcon,
        link: '/aim/associated/profile'
      },
      {
        name: 'Mensajes',
        icon: ChatIcon,
        link: '/aim/associated/chat'
      }
    ]
  }
];

export default menuItems;