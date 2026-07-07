import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import AppHeader from "./components/Header";
import AppFooter from "./components/Footer";

import Login from "./pages/LoginPage";
import Admin from "./pages/InvoiceAdmin";
import InvoiceFlowPage from "./pages/InvoiceFlowPage";

function AppLayout() {
  const location = useLocation();

  const isLoginPage = 
    location.pathname === "/login" || 
    location.pathname === "/";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Hide Header on Login Page */}
      {!isLoginPage && <AppHeader />}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#f4f7fb",
        }}
      >
        <Routes>
          {/* Default Route - Open InvoiceFlowPage directly */}
          <Route path="/" element={<Navigate to="/InvoiceFlowPage" replace />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Invoice Flow Page (Main User Page) */}
          <Route path="/InvoiceFlowPage" element={<InvoiceFlowPage />} />

          {/* Admin Page */}
          <Route path="/InvoiceAdmin" element={<Admin />} />
        </Routes>
      </div>

      {/* Optional Footer (Hide on Login)
      {!isLoginPage && <AppFooter />} */}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}