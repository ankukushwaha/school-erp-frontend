import { backendApi } from './backendApi';

export interface SyllabusItem {
  id: number;
  syllabusName?: string;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  term: string;
  totalTopics: number;
  completedTopics: number;
  status: 'On Track' | 'Behind' | 'Completed';
  lastUpdated: string;
  document?: string;
  academicYear?: string;
}

export const getSyllabusList = async (classId?: number): Promise<SyllabusItem[]> => {
  const response = await backendApi.post('/syllabus/get/all', { classId });
  return response.data;
};

export const createSyllabus = async (data: Partial<SyllabusItem>): Promise<number> => {
  // Map term to termName for backend
  const payload = { ...data, termName: data.term };
  const response = await backendApi.post('/syllabus/create', payload);
  return response.data.id;
};

export const updateSyllabus = async (id: number, data: Partial<SyllabusItem>): Promise<boolean> => {
  const payload = { ...data, termName: data.term };
  const response = await backendApi.put(`/syllabus/update/${id}`, payload);
  return response.data;
};

export const deleteSyllabus = async (id: number): Promise<boolean> => {
  const response = await backendApi.delete(`/syllabus/delete/${id}`);
  return response.data;
};
