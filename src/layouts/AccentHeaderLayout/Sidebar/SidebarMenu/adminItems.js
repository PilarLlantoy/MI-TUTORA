import HowToRegIcon from '@mui/icons-material/HowToReg';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

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
        name: 'Miembros AIM',
        icon: AssignmentIndIcon,
        link: '/aim/admin/members'
      },
      {
        name: 'Asociadas',
        icon: HowToRegIcon,
        link: '/aim/admin/associates'
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
      }
      /*
      {
        name: 'Perfil',
        icon: AnalyticsTwoToneIcon,
        link: '/aim/admin/profile'
      }
      */
    ]
  }
];

export default menuItems;
