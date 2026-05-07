import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { AuthLayout } from "../layouts/AuthLayout";
import { Opportunities } from "../pages/Opportunities";
import { News } from "../pages/News";
import { AdminNews } from "../pages/AdminNews";
import { AdminNewsForm } from "../pages/AdminNewsForm";

export function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/news" element={<News />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="news" element={<AdminNews />} />
          <Route path="news/new" element={<AdminNewsForm />} />
          <Route path="news/edit/:id" element={<AdminNewsForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
