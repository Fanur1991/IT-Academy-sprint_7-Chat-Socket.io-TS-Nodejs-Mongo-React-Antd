import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import AuthPage from './pages/AuthPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { useSocketContext } from './context/SocketContext';

const App: React.FC = () => {
  const { authUser } = useAuthContext();

  // const router = createBrowserRouter([
  //   {
  //     path: '/',
  //     element: authUser ? <Dashboard /> : <Navigate to="/login" />,
  //   },
  //   {
  //     path: '/login',
  //     element: <AuthPage />,
  //   },
  //   {
  //     path: '*',
  //     element: <Navigate to="/" />,
  //   },
  // ]);

  return (
    // <RouterProvider router={router} />
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
