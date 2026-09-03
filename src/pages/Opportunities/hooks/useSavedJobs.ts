import { useCallback, useEffect, useState } from "react";
import { getSavedJobs, saveJob, unsaveJob } from "../../../services/jobsService";
import { mapJob, type Job } from "../mapJob";

export function useSavedJobs(): {
  savedJobs: Job[];
  loading: boolean;
  isSaved: (jobId: number) => boolean;
  toggleSave: (job: Job) => void;
} {
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getSavedJobs()
      .then((data) => {
        if (cancelled) return;
        setSavedJobs(data.map(mapJob));
        setSavedIds(new Set(data.map((job) => job.id)));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isSaved = useCallback((jobId: number) => savedIds.has(jobId), [savedIds]);

  const toggleSave = useCallback(
    (job: Job) => {
      const currentlySaved = savedIds.has(job.id);

      setSavedIds((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.delete(job.id);
        else next.add(job.id);
        return next;
      });
      setSavedJobs((prev) => (currentlySaved ? prev.filter((j) => j.id !== job.id) : [job, ...prev]));

      const request = currentlySaved ? unsaveJob(job.id) : saveJob(job.id);
      request.catch(() => {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (currentlySaved) next.add(job.id);
          else next.delete(job.id);
          return next;
        });
        setSavedJobs((prev) => (currentlySaved ? [job, ...prev] : prev.filter((j) => j.id !== job.id)));
      });
    },
    [savedIds]
  );

  return { savedJobs, loading, isSaved, toggleSave };
}
