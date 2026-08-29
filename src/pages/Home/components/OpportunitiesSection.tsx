import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeJobCard } from "./HomeJobCard";
import { getLatestJobs, type JobRawDto } from "../../../services/jobsService";

type JobsResponse = JobRawDto[] | { jobs?: JobRawDto[]; content?: JobRawDto[]; data?: JobRawDto[] };

export function OpportunitiesSection() {
  const [jobs, setJobs] = useState<JobRawDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLatestJobs()
      .then((data) => {
        const payload = data as unknown as JobsResponse;
        setJobs(Array.isArray(payload) ? payload : (payload?.jobs ?? payload?.content ?? payload?.data ?? []));
      })
      .catch(() => setError("Não foi possível carregar as oportunidades."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="h-full bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-dark-green">Oportunidades</h2>
        <Link to="/opportunities" className="text-sm font-semibold text-green hover:underline">
          Ver todas
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <HomeJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
