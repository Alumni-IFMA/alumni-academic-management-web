import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HeroSection } from "./components/HeroSection";
import { ShortcutCards } from "./components/ShortcutCards";
import { NewsSection } from "./components/NewsSection";
import { OpportunitiesSection } from "./components/OpportunitiesSection";

export function Home() {
  const { userName } = useAuth();
  const navigate = useNavigate();

  function handleSearch(term: string) {
    navigate(`/rede?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <HeroSection userName={userName ?? "Usuário"} onSearch={handleSearch} />
      <ShortcutCards />

      {/* Bottom two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 items-stretch">
        <div className="lg:col-span-2">
          <NewsSection />
        </div>
        <div className="lg:col-span-1">
          <OpportunitiesSection />
        </div>
      </div>
    </div>
  );
}
