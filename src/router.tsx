import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import LoginPage from './content/pages/Login';
import CreateItem from './content/applications/Item/CreateItem';
import UpdateItem from './content/applications/Item/UpdateItem';
import UpdateItemType from './content/applications/ItemType/UpdateItemType';
import CreateItemType from './content/applications/ItemType/CreateItemType';
import UpdateCategory from './content/applications/Category/UpdateCategory';
import CreateCategory from './content/applications/Category/CreateCategory';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Pages

// Dashboards

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

// Applications

const Messenger = Loader(
  lazy(() => import('src/content/applications/Messenger'))
);
const Transactions = Loader(
  lazy(() => import('src/content/applications/Item'))
);
const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/content/applications/Users/settings'))
);
const ItemType = Loader(
  lazy(() => import('src/content/applications/ItemType'))
);
const Category = Loader(
  lazy(() => import('src/content/applications/Category'))
);
const Users = Loader(
  lazy(() => import('src/content/applications/Users'))
)

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  // {
  //   path: '',
  //   element: <BaseLayout />,
  //   children: [
  //     {
  //       path: '',
  //       element: <Navigate to="login" replace />
  //     },
  //     {
  //       path: 'login',
  //       element: <LoginPage />
  //     },
  //   ]
  // },
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="login" replace />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },

  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        // path: '',
        // element: <Navigate to="rosaceae" replace />
      },
      {
        path: 'rosaceae',
        element: <Crypto />
      },
      {
        path: 'messenger',
        element: <Messenger />
      }
    ]
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="transactions" replace />
      },
      {
        path: 'item',
        element: <Transactions />
      },
      {
        path: 'item/:id/update',
        element: <UpdateItem />
      },
      {
        path: 'item/createItem',
        element: <CreateItem />
      },
      {
        path: 'itemType',
        element: <ItemType />
      },
      {
        path: 'itemType/:id/update',
        element: <UpdateItemType />
      },
      {
        path: 'itemType/createItemType',
        element: <CreateItemType />
      },
      {
        path: 'category',
        element: <Category />
      },
      {
        path: 'category/:id/update',
        element: <UpdateCategory />
      },
      {
        path: 'category/createCategory',
        element: <CreateCategory />
      },
      {
        path: 'user',
        element: <Users />
      },


      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          }
        ]
      }
    ]
  },
  {
    path: 'base',
    element: <BaseLayout />,
    children: [
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      }
    ]
  }
];

export default routes;
