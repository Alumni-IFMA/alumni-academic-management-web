import api from "./api";

export interface CampusCourse {
  id: number;
  campusName: string;
  modality: string;
  courseName: string;
}

async function getAll(): Promise<CampusCourse[]> {
  const { data } = await api.get<CampusCourse[]>("/campus-courses");
  return data;
}

export default { getAll };
