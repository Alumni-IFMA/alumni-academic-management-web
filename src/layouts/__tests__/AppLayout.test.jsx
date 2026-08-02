import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { AuthContext } from "../../context/AuthContext";
import { AppLayout } from "../AppLayout";

const fakeAuth = { isAuthenticated: true, userName: "Kenia", login: vi.fn(), logout: vi.fn() };

function renderAt(path) {
  return render(
    <AuthContext.Provider value={fakeAuth}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<div>Home content</div>} />
            <Route path="/diploma" element={<div>Diploma content</div>} />
            <Route path="/news" element={<div>News content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("AppLayout ribbon", () => {
  it("renders the diploma ribbon svg on /diploma", () => {
    const { container } = renderAt("/diploma");
    expect(screen.getByText("Diploma content")).toBeInTheDocument();
    expect(container.querySelector('svg[viewBox="0 0 1583 927"]')).toBeInTheDocument();
  });

  it("does not render a ribbon svg on routes without one", () => {
    const { container } = renderAt("/news");
    expect(screen.getByText("News content")).toBeInTheDocument();
    expect(container.querySelector('svg[viewBox="0 0 1583 927"]')).not.toBeInTheDocument();
  });
});
