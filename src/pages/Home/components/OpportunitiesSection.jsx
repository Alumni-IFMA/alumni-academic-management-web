import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeJobCard } from "./HomeJobCard";
import { getLatestJobs } from "../../../services/jobsService";

export function OpportunitiesSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLatestJobs()
      .then(setJobs)
      .catch(() => setError("Não foi possível carregar as oportunidades."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-dark-green">Oportunidades</h2>
        <Link to="/opportunities" className="text-sm font-semibold text-green hover:underline">
          Ver todas
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <HomeJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
