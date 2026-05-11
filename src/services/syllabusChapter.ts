import { backendApi } from './backendApi';

export interface SyllabusChapterItem {
  syllabusChapterId: number;
  syllabusId: number;
  chapterName: string;
  chapterOrder: number;
  isCompleted: boolean;
  syllabusName?: string; // For display purposes if needed
}

export const getSyllabusChapterList = async (syllabusId?: number): Promise<SyllabusChapterItem[]> => {
  const response = await backendApi.post('/syllabus-chapter/get/all', { syllabusId });
  return response.data;
};

export const createSyllabusChapter = async (data: Partial<SyllabusChapterItem>): Promise<number> => {
  const response = await backendApi.post('/syllabus-chapter/create', data);
  return response.data.syllabusChapterId;
};

export const updateSyllabusChapter = async (id: number, data: Partial<SyllabusChapterItem>): Promise<boolean> => {
  const response = await backendApi.put(`/syllabus-chapter/update/${id}`, data);
  return response.data;
};

export const deleteSyllabusChapter = async (id: number): Promise<boolean> => {
  const response = await backendApi.delete(`/syllabus-chapter/delete/${id}`);
  return response.data;
};
