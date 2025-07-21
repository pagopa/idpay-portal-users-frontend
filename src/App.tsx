import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRequirements from './pages/VerifyRequirements/VerifyRequirements';
import ROUTES from './routes';

const LocalRoutes = () => (
  <Routes>
    <Route path={ROUTES.DASHBOARD} element={<Layout hasSidebar={true}><Dashboard/></Layout>} />
    <Route path={ROUTES.VERIFY_REQUIREMENTS} element={<Layout hasSidebar={false}><VerifyRequirements/></Layout>} />
  </Routes>
);

function App() {
  return (
		<LocalRoutes />
	);
}

export default App;