import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import AuthPage from './pages/AuthPage';
import { useAuthContext } from './context/AuthContext';

const App: React.FC = () => {
  const { authUser } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
