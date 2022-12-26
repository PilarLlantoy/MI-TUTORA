import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Student

const Courses = Loader(lazy(() => import('src/content/student/courses')));
const FeedbackPostClass = Loader(lazy(() => import('src/content/student/temp')));
const Reservations = Loader(
  lazy(() => import('src/content/student/reservations'))
);
const AssociatedProfile = Loader(
  lazy(() => import('src/content/student/associatedProfile'))
);

const Classes = Loader(lazy(() => import('src/content/student/classes')));
const VideoConference = Loader(lazy(() => import('src/components/Room')));
const Chat = Loader(lazy(() => import('src/content/chat')));
const AuthRoom = Loader(lazy(() => import('src/components/AuthRoom')));

const studentRoutes = [
  {
    path: '/',
    element: <Navigate to="courses" replace />
  },
  {
    path: 'courses',
    element: <Courses />
  },
  {
    path: 'temp/:classId',
    element: <FeedbackPostClass />
  },
  {
    path: 'reservations',
    element: <Reservations />
  },
  {
    path: 'profile/:idAssociated',
    element: <AssociatedProfile />
  },
  {
    path: 'classes/',
    element: <Classes />
  },
  {
    path: 'room/:roomId/:classId',
    element: <AuthRoom><VideoConference/></AuthRoom>
  },
  {
    path: 'chat',
    element: <Chat />
  },
];

export default studentRoutes;
