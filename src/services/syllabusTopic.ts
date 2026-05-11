import { backendApi } from './backendApi';

export interface SyllabusTopicItem {
  topicId: number;
  syllabusChapterId: number;
  chapterName?: string;
  topicName: string;
  topicContent?: string;
  isCompleted: boolean;
  completedDate?: string;
}

export const getSyllabusTopicList = async (syllabusChapterId?: number): Promise<SyllabusTopicItem[]> => {
  const response = await backendApi.post('/syllabus-topic/get/all', { syllabusChapterId });
  return response.data;
};

export const createSyllabusTopic = async (data: Partial<SyllabusTopicItem>): Promise<number> => {
  const response = await backendApi.post('/syllabus-topic/create', data);
  return response.data.topicId;
};

export const updateSyllabusTopic = async (id: number, data: Partial<SyllabusTopicItem>): Promise<boolean> => {
  const response = await backendApi.put(`/syllabus-topic/update/${id}`, data);
  return response.data;
};

export const deleteSyllabusTopic = async (id: number): Promise<boolean> => {
  const response = await backendApi.delete(`/syllabus-topic/delete/${id}`);
  return response.data;
};
