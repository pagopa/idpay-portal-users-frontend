import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRequirements from './pages/VerifyRequirements/VerifyRequirements';
import InsertEmail from './pages/InsertEmail/InsertEmail';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ROUTES from './routes';

const LocalRoutes = () => (
  <Routes>
    <Route path={ROUTES.DASHBOARD} element={<Layout hasSidebar={true}><Dashboard/></Layout>} />
    <Route path={ROUTES.VERIFY_REQUIREMENTS} element={<Layout hasSidebar={false}><VerifyRequirements/></Layout>} />
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