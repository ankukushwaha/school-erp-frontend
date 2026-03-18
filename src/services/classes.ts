import { backendApi } from '@/services/backendApi'

export type SchoolClass = {
  id: number
  name: string
  code: string
  order: number
  maximumCapacity: number
  description: string
  sections: number
  students: number
  subjects: number
}

export type CreateClassPayload = {
  classCode: string
  className: string
  classOrder: number
  maximumCapacity: number
  description: string
}

export type UpdateClassPayload = {
  classId: number
  classCode: string
  className: string
  classOrder: number
  maximumCapacity: number
  description: string
}

type ClassApiRecord = {
  id?: unknown
  classId?: unknown
  name?: unknown
  className?: unknown
  displayName?: unknown
  code?: unknown
  classCode?: unknown
  classOrder?: unknown
  numericGradeLevel?: unknown
  gradeLevel?: unknown
  maximumCapacity?: unknown
  maxCapacity?: unknown
  capacity?: unknown
  description?: unknown
  sections?: unknown
  sectionCount?: unknown
  noOfSections?: unknown
  students?: unknown
  studentCount?: unknown
  totalStudents?: unknown
  subjects?: unknown
  subjectCount?: unknown
  totalSubjects?: unknown
}

type ClassesApiResponse = ClassApiRecord[] | { data?: unknown; items?: unknown; result?: unknown; records?: unknown }

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

function getItems(payload: ClassesApiResponse): ClassApiRecord[] {
  if (Array.isArray(payload)) return payload
  const data = payload.data ?? payload.items ?? payload.result ?? payload.records
  return Array.isArray(data) ? (data as ClassApiRecord[]) : []
}

function normalizeClass(record: ClassApiRecord, index: number): SchoolClass {
  return {
    id: asNumber(record.id ?? record.classId, index + 1),
    name: asString(record.className ?? record.name ?? record.displayName, `Class ${index + 1}`),
    code: asString(record.classCode ?? record.code, `CL${index + 1}`),
    order: asNumber(record.classOrder ?? record.numericGradeLevel ?? record.gradeLevel, index + 1),
    maximumCapacity: asNumber(record.maximumCapacity ?? record.maxCapacity ?? record.capacity, 0),
    description: asString(record.description),
    sections: asNumber(record.sections ?? record.sectionCount ?? record.noOfSections, 0),
    students: asNumber(record.students ?? record.studentCount ?? record.totalStudents, 0),
    subjects: asNumber(record.subjects ?? record.subjectCount ?? record.totalSubjects, 0),
  }
}

export async function getClasses(): Promise<SchoolClass[]> {
  const response = await backendApi.get<ClassesApiResponse>('/master/class')
  return getItems(response.data).map(normalizeClass)
}

export async function createClass(payload: CreateClassPayload): Promise<void> {
  await backendApi.post('/master/class', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}

export async function updateClass(payload: UpdateClassPayload): Promise<void> {
  await backendApi.put('/master/class', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteClass(classId: number): Promise<void> {
  await backendApi.delete(`/master/class/${classId}`, {
    headers: {
      accept: '*/*',
    },
  })
}
