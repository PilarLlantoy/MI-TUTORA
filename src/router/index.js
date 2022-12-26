import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import accountRoutes from './account';
import baseRoutes from './base';
import studentRoutes from './student';
import associatedRoutes from './associated';
import memberRoutes from './member';
import adminRoutes from './admin';

const router = [
  {
    path: 'account',
    children: accountRoutes
  },
  {
    path: '*',
    element: <BaseLayout />,
    children: baseRoutes
  },

  // Accent Header Layout
  // aim/student/
  // aim/associated/
  // aim/member/
  // aim/admin/
  {
    path: 'aim',
    element: (
      <Authenticated>
        <AccentHeaderLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="student" replace />
      },
      {
        path: 'student',
        children: studentRoutes
      },
      {
        path: 'associated',
        children: associatedRoutes
      },
      {
        path: 'member',
        children: memberRoutes
      },
      {
        path: 'admin',
        children: adminRoutes
      }
    ]
  }
];

export default router;
