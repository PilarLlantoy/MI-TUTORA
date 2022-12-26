import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Member

const Associates = Loader(lazy(() => import('src/content/member/associates')));
const ChatTest = Loader(lazy(() => import('src/content/member/chat-test')));
const Requests = Loader(lazy(() => import('src/content/member/requests')));
const ComplaintRequests = Loader(lazy(() => import('src/content/member/requests/complaintRequest')));
const ProfileRequests = Loader(lazy(() => import('src/content/member/requests/profileRequest')));
const SubjectRequests = Loader(lazy(() => import('src/content/member/requests/subjectRequest')));
const Students = Loader(lazy(() => import('src/content/member/students')));
const Training = Loader(lazy(() => import('src/content/member/training')));
const CategoriesTopics = Loader(
  lazy(() => import('src/content/member/categories-topics'))
);
const Modules = Loader(
  lazy(() => import('src/content/member/training/addEditModules'))
);
const AwsTest = Loader(lazy(() => import('src/content/awstest')));
const Chat = Loader(lazy(() => import('src/content/chat')));
const AsociatedResults = Loader(lazy(() => import('src/content/member/training/asociatedResults')));
const AssociatedProfile = Loader(
  lazy(() => import('src/content/member/associates/associatedProfile'))
);


const memberRoutes = [
  {
    path: '/',
    element: <Navigate to="associates" replace />
  },
  {
    path: 'associates',
    element: <Associates />
  },
  {
    path: 'profile/:idAssociated',
    element: <AssociatedProfile />
  },
  {
    path: 'categories-topics',
    element: <CategoriesTopics />
  },
  {
    path: 'students',
    element: <Students />
  },
  {
    path: 'capacitations',
    element: <Training />,
    children: []
  },
  {
    path: 'modules',
    element: <Modules />
  },
  {
    path: 'ChatTest',
    element: <ChatTest />
  },
  {
    path: 'requests',
    element: <Requests />
  },
  {
    path: 'requests/complaintRequest',
    element: <ComplaintRequests />
  },
  {
    path: 'requests/profileRequest',
    element: <ProfileRequests />
  },
  {
    path: 'requests/subjectRequest',
    element: <SubjectRequests />
  },
  {
    path: 'awstest',
    element: <AwsTest />
  },
  {
    path: 'chat',
    element: <Chat />
  },
  {
    path: 'module-asociated-results',
    element: <AsociatedResults />
  },
];

export default memberRoutes;
