import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Teacher

const Courses = Loader(lazy(() => import('src/content/associated/courses')));
const Classes = Loader(lazy(() => import('src/content/associated/classes')));
const Profile = Loader(lazy(() => import('src/content/associated/profile')));
const Capacitations = Loader(lazy(() => import('src/content/associated/capacitations')));
const SeeCapacitations = Loader(lazy(() => import('src/content/associated/capacitations/seecapacitation')));
const Disponibility = Loader(lazy(() => import('src/content/associated/disponibility')));
const Reservations = Loader(
  lazy(() => import('src/content/associated/reservations'))
);
const Requests = Loader(lazy(() => import('src/content/associated/requests')));
const VideoConference = Loader(lazy(() => import('src/components/Room')));
const Chat = Loader(lazy(() => import('src/content/chat')));
const AuthRoom = Loader(lazy(() => import('src/components/AuthRoom')));

const associatedRoutes = [
  {
    path: '/',
    element: <Navigate to="capacitations" replace />
  },
  {
    path: 'requests',
    element: <Requests />
  },
  {
    path: 'reservations',
    element: <Reservations />
  },
  {
    path: 'courses',
    element: <Courses />
  },
  {
    path: 'classes/',
    element: <Classes />
  },
  {
    path: 'profile',
    element: <Profile />
  },
  {
    path: 'capacitations',
    children: [
      {
        path: '/',
        element: <Capacitations />
      },
      {
        path: 'seeCapacitation',
        element: <SeeCapacitations />
      }
    ]
  },
  {
    path: 'disponibility',
    element: <Disponibility />
  },
  {
    path: 'room/:roomId/:classId',
    element: <AuthRoom><VideoConference /></AuthRoom>
  },
  {
    path: 'chat',
    element: <Chat />
  },
];

export default associatedRoutes;
