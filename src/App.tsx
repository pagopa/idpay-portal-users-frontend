import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRequirements from './pages/VerifyRequirements/VerifyRequirements';
import TOS from './pages/TOS/TOS';
import InsertEmail from './pages/InsertEmail/InsertEmail';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ROUTES from './routes';

const LocalRoutes = () => (
  <Routes>
    {/* TODO tmp fallback route */}
    <Route index path="*" element={<Layout hasSidebar={false} hasSubHeader={false} hasPadding={false}><TOS/></Layout>} /> 
    <Route path={ROUTES.DASHBOARD} element={<Layout hasSidebar={true}><Dashboard/></Layout>} />
    <Route path={ROUTES.VERIFY_REQUIREMENTS} element={<Layout hasSidebar={false}><VerifyRequirements/></Layout>} />
    <Route path={ROUTES.TOS} element={<Layout hasSidebar={false} hasSubHeader={false} hasPadding={false}><TOS/></Layout>} />
    <Route path={ROUTES.INSERT_EMAIL} element={<Layout hasSidebar={false}><InsertEmail /></Layout>} />
    <Route path={ROUTES.FEEDBACK} element={<Layout hasSidebar={false}><FeedbackPage /></Layout>} />
  </Routes>
);

function App() {
  return (
    <LocalRoutes />
  );
}

export default App;