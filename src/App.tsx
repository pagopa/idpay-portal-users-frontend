import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRequirements from './pages/VerifyRequirements/VerifyRequirements';

function App() {
  return (
    <Routes>
      <Route path="/utente/dashboard" element={<Layout hasSidebar={true}><Dashboard/></Layout>} />
      <Route path="/utente/verifyRequirements" element={<Layout hasSidebar={false}><VerifyRequirements/></Layout>} />
    </Routes>
  );
}

export default App;