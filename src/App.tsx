import './App.css';
// import { useEffect } from 'react';
// import { useAuth } from 'react-oidc-context';

import Layout from './components/Layout/Layout';

function App() {
  // TODO 
  // const = useAuth();

  // useEffect(() => {
  //   if (!auth.isLoading && !auth.isAuthenticated) {
  //     auth.signinRedirect();
  //   }
  // }, [auth.isLoading, auth.isAuthenticated])

  // if (auth.isLoading) {
  //   return <div>Caricamento sessione...</div>;
  // }

  // if (!auth.isAuthenticated) {
  //   return <div>Reindirizzamento al login...</div>;
  // }

  return <Layout />;
}

export default App;
