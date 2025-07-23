import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRequirements from './pages/VerifyRequirements/VerifyRequirements';
import TOS from './pages/TOS/TOS';
import ROUTES from './routes';

const LocalRoutes = () => (
  <Routes>
    <Route path={ROUTES.DASHBOARD} element={<Layout hasSidebar={true}><Dashboard/></Layout>} />
    <Route path={ROUTES.VERIFY_REQUIREMENTS} element={<Layout hasSidebar={false}><VerifyRequirements/></Layout>} />
    <Route path={ROUTES.TOS} element={<Layout hasSidebar={false} hasSubHeader={false} hasPadding={false}><TOS/></Layout>} />
  </Routes>
);

function App() {
  return (
		<LocalRoutes />
	);
}

export default App;