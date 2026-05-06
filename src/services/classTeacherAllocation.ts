import { backendApi } from '@/services/backendApi'

export type ClassTeacherAllocationRecord = {
  classTeacherId?: unknown
  academicYearId?: unknown
  academicYearName?: unknown
  schoolId?: unknown
  classId?: unknown
  className?: unknown
  sectionId?: unknown
  sectionName?: unknown
  teacherId?: unknown
  teacherName?: unknown
  email?: unknown
  phone?: unknown
  isActive?: unknown
}

export type ClassTeacherAllocation = {
  id: number
  academicYearId: number
  academicYearName: string
  schoolId: number
  classId: number
  className: string
  sectionId: number
  sectionName: string
  teacherId: number
  teacherName: string
  email: string
  phone: string
  isActive: boolean
  subjects: string[] // Added for UI compatibility
  studentCount: number // Added for UI compatibility
}

export type CreateClassTeacherAllocationPayload = {
  academicYearId: number
  schoolId: number
  classId: number
  sectionId: number
  teacherId: number
  isActive: boolean
}

export type UpdateClassTeacherAllocationPayload = CreateClassTeacherAllocationPayload & {
  classTeacherId: number
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return fallback
}

function normalizeAllocation(record: ClassTeacherAllocationRecord): ClassTeacherAllocation {
  return {
    id: asNumber(record.classTeacherId, 0),
    academicYearId: asNumber(record.academicYearId, 0),
    academicYearName: asString(record.academicYearName),
    schoolId: asNumber(record.schoolId, 0),
    classId: asNumber(record.classId, 0),
    className: asString(record.className),
    sectionId: asNumber(record.sectionId, 0),
    sectionName: asString(record.sectionName),
    teacherId: asNumber(record.teacherId, 0),
    teacherName: asString(record.teacherName),
    email: asString(record.email),
    phone: asString(record.phone),
    isActive: Boolean(record.isActive),
    subjects: [], // Backend doesn't provide these yet
    studentCount: 0, // Backend doesn't provide these yet
  }
}

export async function getClassTeacherAllocations(): Promise<ClassTeacherAllocation[]> {
  const response = await backendApi.get<ClassTeacherAllocationRecord[]>('/MClassTeacher')
  return response.data.map(normalizeAllocation)
}

export async function createClassTeacherAllocation(payload: CreateClassTeacherAllocationPayload): Promise<void> {
  await backendApi.post('/MClassTeacher', payload)
}

export async function updateClassTeacherAllocation(id: number, payload: UpdateClassTeacherAllocationPayload): Promise<void> {
  await backendApi.put(`/MClassTeacher/${id}`, payload)
}

export async function deleteClassTeacherAllocation(id: number, deletedBy: string): Promise<void> {
  await backendApi.delete(`/MClassTeacher/${id}`, {
    params: { deletedBy }
  })
}
