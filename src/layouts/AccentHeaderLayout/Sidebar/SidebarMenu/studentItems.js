import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const menuItems = [
  {
    heading: '',
    items: [
      {
        name: 'Mis Clases',
        icon: BackupTableTwoToneIcon,
        link: '/aim/student/classes'
      },
      {
        name: 'Reservas',
        icon: SmartToyTwoToneIcon,
        link: '/aim/student/reservations'
      },
      // {
      //   name: 'Mensajes',
      //   icon: HealthAndSafetyTwoToneIcon,
      //   link: '/aim/student/messages'
      // },
      {
        name: 'Cursos',
        icon: AnalyticsTwoToneIcon,
        link: '/aim/student/courses'
      },
      {
        name: 'Capacitaciones',
        icon: BackupTableTwoToneIcon,
        link: '/aim/student/capacitations'
      },
      {
        name: 'Disponibilidad',
        icon: SmartToyTwoToneIcon,
        link: '/aim/student/disponibility'
      },
      {
        name: 'Pagos',
        icon: HealthAndSafetyTwoToneIcon,
        link: '/aim/student/payments'
      },
      {
        name: 'Perfil',
        icon: AnalyticsTwoToneIcon,
        link: '/aim/student/profile'
      },
      {
        name: 'Mensajes',
        icon: AccountCircleIcon,
        link: '/aim/student/chat'
      }
    ]
  }
];

export default menuItems;
