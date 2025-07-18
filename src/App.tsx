import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRequirements from './pages/VerifyRequirements/VerifyRequirements';

const router = createBrowserRouter([
  {
    path: '/utente',
    element: <Layout />,
    children: [
      {
        path: '/utente/dashboard',
        index: true,
        element: <Dashboard />,
        handle: { hasSidebar: true },
      },
      {
        path: '/utente/verifyRequirements',
        index: true,
        element: <VerifyRequirements />,
        handle: { hasSidebar: false },
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}