import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Guest from 'src/components/Guest';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Account

const LoginCover = Loader(
  lazy(() => import('src/content/pages/Auth/Login/Cover'))
);
// const LoginBasic = Loader(
//   lazy(() => import('src/content/pages/Auth/Login/Basic'))
// );

// const RegisterCover = Loader(
//   lazy(() => import('src/content/pages/Auth/Register/Cover'))
// );
// const RegisterBasic = Loader(
//   lazy(() => import('src/content/pages/Auth/Register/Basic'))
// );
const RegisterGoogle = Loader(
  lazy(() => import('src/content/pages/Auth/Register/Wizard/Google'))
);

const RegisterClassic = Loader(
  lazy(() => import('src/content/pages/Auth/Register/Wizard/Classic'))
);

const RecoverPassword = Loader(
  lazy(() => import('src/content/pages/Auth/RecoverPassword'))
);

const accountRoutes = [
  {
    path: 'login',
    element: (
      <Guest>
        <LoginCover />
      </Guest>
    )
  },
  {
    path: 'register/google',
    element: <RegisterGoogle />
  },
  {
    path: 'register/classic',
    element: <RegisterClassic />
  },
  // {
  //   path: 'login-basic',
  //   element: <LoginBasic />
  // },
  // {
  //   path: 'login-cover',
  //   element: <LoginCover />
  // },
  {
    path: 'recover-password',
    element: <RecoverPassword />
  }
  // {
  //   path: 'register',
  //   element: (
  //     <Guest>
  //       <RegisterCover />
  //     </Guest>
  //   )
  // },
  // {
  //   path: 'register-basic',
  //   element: <RegisterBasic />
  // },
  // {
  //   path: 'register-cover',
  //   element: <RegisterCover />
  // },
  // {
  //   path: 'register-wizard',
  //   element: <RegisterWizard />
  // }
];

export default accountRoutes;
