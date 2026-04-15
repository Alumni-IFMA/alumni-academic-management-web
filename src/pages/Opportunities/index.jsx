import { Navbar } from "../../components/Navbar/Navbar.jsx";
import { Typography } from "../../components/Typography/Typography.jsx";

export function Opportunities() {
  return (
    <div className="font-poppins">
      <Navbar />
      <div className="mt-11 ml-11">
        <Typography variant="h1">Encontre oportunidades</Typography>
        <Typography variant="p">Explore e encontre uma vaga perfeita para você.</Typography>
      </div>
    </div>
  );
}