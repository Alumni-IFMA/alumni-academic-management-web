import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { AuthLayout } from "../layouts/AuthLayout";
import { Opportunities } from "../pages/Opportunities";

export function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/opportunities" element={<Opportunities />} />
      </Routes>
    </BrowserRouter>
  );
}