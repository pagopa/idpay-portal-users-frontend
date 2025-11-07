import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRequirements from './pages/VerifyRequirements/VerifyRequirements';
import TOS from './pages/TOS/TOS';
import InsertEmail from './pages/InsertEmail/InsertEmail';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ROUTES from './routes';
import { useIsMobile } from './hooks/useIsMobile';
import LandingPage from './pages/LandingPage/LandingPage';
import AssistancePage from './pages/AssistancePage/AssistancePage';
import ProtectedRoute from './config/ProtectedRoute';
import GatewayPage from './pages/GatewayPage/GatewayPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import WaitingPage from './pages/WaitingPage/WaitingPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import UpcomingInitiative from "./pages/UpcomingInitiative/UpcomingInitiative.tsx";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout hasPadding={false} >
    {children}
  </Layout>
);

const PrivateLayout: React.FC<{
  children: React.ReactNode;
  hasPadding?: boolean;
}> = ({ children, hasPadding = undefined }) => (
  <ProtectedRoute>
    <Layout hasPadding={hasPadding}>
      {children}
    </Layout>
  </ProtectedRoute>
);

const LocalRoutes: React.FC<{ isMobile: boolean }> = () => (
  <Routes>
    {/* fallback */}
    <Route path="*" element={<PublicLayout ><LandingPage /></PublicLayout>} />

    {/* public route */}
    <Route path={ROUTES.HOME} element={<PublicLayout ><LandingPage /></PublicLayout>} />

    {/* assistance route */}
    <Route path={ROUTES.ASSISTANCE} element={<PublicLayout ><AssistancePage /></PublicLayout>} />

    {/* gateway route */}
    <Route path={ROUTES.GATEWAY}
      element={<PublicLayout ><GatewayPage /></PublicLayout>} />

    {/* error page */}
    <Route path={ROUTES.ERROR_PAGE} element={<PublicLayout ><ErrorPage /></PublicLayout>} />

    {/* upcoming initiative */}
    <Route path={ROUTES.UPCOMING_INITIATIVE} element={<PublicLayout ><UpcomingInitiative /></PublicLayout>} />

    {/* private route */}
    <Route
      path={ROUTES.DASHBOARD}
      element={<PrivateLayout hasPadding={false} ><Dashboard /></PrivateLayout>}
    />
    <Route
      path={ROUTES.VERIFY_REQUIREMENTS}
      element={<PrivateLayout><VerifyRequirements /></PrivateLayout>}
    />
    <Route
      path={ROUTES.TOS}
      element={<PrivateLayout hasPadding={false}><TOS /></PrivateLayout>}
    />
    <Route
      path={ROUTES.INSERT_EMAIL}
      element={<PrivateLayout><InsertEmail /></PrivateLayout>}
    />
    <Route
      path={ROUTES.FEEDBACK}
      element={<PrivateLayout><FeedbackPage /></PrivateLayout>}
    />
    <Route
      path={ROUTES.WAITING_PAGE}
      element={<PrivateLayout><WaitingPage /></PrivateLayout>}
    />
  </Routes>
);

function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <ScrollToTop />
      <LocalRoutes isMobile={isMobile}/>
    </>
  );
}

export default App;