import { api } from '@/services/api'

export type Student = {
  id: number
  name: string
  email: string
}

export async function getStudents(): Promise<Student[]> {
  const response = await api.get<Student[]>('/users')
  return response.data
}
