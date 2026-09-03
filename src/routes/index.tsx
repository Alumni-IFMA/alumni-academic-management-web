import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { Diploma } from "../pages/Diploma";
import { SetPassword } from "../pages/SetPassword";
import { ForgotPassword } from "../pages/ForgotPassword";
import { VerifyResetCode } from "../pages/VerifyResetCode";
import { ResetPassword } from "../pages/ResetPassword";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { Opportunities } from "../pages/Opportunities";
import { News } from "../pages/News";
import { NewsDetail } from "../pages/NewsDetail";
import { AdminNews } from "../pages/AdminNews";
import { AdminNewsForm } from "../pages/AdminNewsForm";
import { AdminLayout } from "../layouts/AdminLayout";
import { AuthProvider, useAuth } from "../context/AuthContext";
import RedeAlumni from "../pages/Network/RedeAlumni";
import { Contact } from "../pages/Contact";
import { Profile } from "../pages/Profile";
import { Notifications } from "../pages/Notifications";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="set-password" element={<SetPassword />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/code" element={<VerifyResetCode />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/diploma" element={<Diploma />} />
        <Route path="/rede" element={<RedeAlumni />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/perfil/:id" element={<Profile />} />
        <Route path="/notificacoes" element={<Notifications />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/opportunities" element={<Opportunities />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="news" element={<AdminNews />} />
        <Route path="news/new" element={<AdminNewsForm />} />
        <Route path="news/edit/:id" element={<AdminNewsForm />} />
      </Route>
    </Routes>
  );
}

export function AppRoute() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}