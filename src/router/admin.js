import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Admin

const Associates = Loader(lazy(() => import('src/content/admin/associates')));
const Members = Loader(lazy(() => import('src/content/admin/members')));
const Students = Loader(lazy(() => import('src/content/member/students')));

const adminRoutes = [
  {
    path: '/',
    element: <Navigate to="members" replace />
  },
  {
    path: 'associates',
    element: <Associates />
  },
  {
    path: 'members',
    element: <Members />
  },
  {
    path: 'students',
    element: <Students />
  }
];

export default adminRoutes;