import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { Opportunities } from "../pages/Opportunities";
import { News } from "../pages/News";
import { AdminNews } from "../pages/AdminNews";
import { AdminNewsForm } from "../pages/AdminNewsForm";
import { AdminLayout } from "../layouts/AdminLayout";
import { AuthProvider, useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
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
      </Route>
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/news" element={<News />} />
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
