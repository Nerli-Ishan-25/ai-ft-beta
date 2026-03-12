import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardApp from './pages/DashboardApp';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Onboarding from './pages/Onboarding';
import FontLoader from './components/FontLoader';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("loggedUser");
  const onboarded = localStorage.getItem("financialProfile");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const RootRoute = () => {
  const user = localStorage.getItem("loggedUser");
  const onboarded = localStorage.getItem("financialProfile");

  if (!user) return <Navigate to="/login" replace />;
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <FontLoader />
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/onboarding"
          element={
            localStorage.getItem("loggedUser") ? <Onboarding /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardApp />
            </ProtectedRoute>
          }
        />
        {/* Wildcard to handle 404s/unknown routes back to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
