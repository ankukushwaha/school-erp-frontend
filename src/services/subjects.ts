import { backendApi } from '@/services/backendApi'

export type SubjectCategory = 'Academic' | 'Non-Academic'

export type SubjectRecord = {
  id: string
  subjectCode: string
  subjectName: string
  isOptional: boolean
  subjectType: string
  category: SubjectCategory | null
  description: string
  totalMarks: number
  passingMarks: number
  isActive: boolean
  createdDate: string
}

export type CreateSubjectPayload = {
  subjectId: 0
  subjectName: string
  subjectCode: string
  isOptional: boolean
  subjectType: string
  category: SubjectCategory
  description: string
  minMarks: number
  maxMarks: number
  passMarks: number
  authAdd: string
  authLstEdt: string | null
  authDel: string | null
  addOnDt: string
  editOnDt: string | null
  delOnDt: string | null
  delStatus: boolean
}

export type UpdateSubjectPayload = {
  subjectId: number
  subjectName: string
  subjectCode: string
  isOptional: boolean
  subjectType: string
  category: SubjectCategory
  description: string
  minMarks: number
  maxMarks: number
  passMarks: number
  authAdd: string
  authLstEdt: string | null
  authDel: string | null
  addOnDt: string | null
  editOnDt: string | null
  delOnDt: string | null
  delStatus: boolean
}

type SubjectApiRecord = {
  subjectId?: unknown
  subjectName?: unknown
  subjectCode?: unknown
  isOptional?: unknown
  subjectType?: unknown
  category?: unknown
  description?: unknown
  minMarks?: unknown
  maxMarks?: unknown
  passMarks?: unknown
  authAdd?: unknown
  authLstEdt?: unknown
  authDel?: unknown
  addOnDt?: unknown
  editOnDt?: unknown
  delOnDt?: unknown
  delStatus?: unknown
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

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
  }
  return fallback
}

function normalizeSubject(record: SubjectApiRecord, index: number): SubjectRecord {
  const subjectType = asString(record.subjectType, 'Core')
  const category = asString(record.category)

  return {
    id: String(asNumber(record.subjectId, index + 1)),
    subjectCode: asString(record.subjectCode, `SUB${index + 1}`),
    subjectName: asString(record.subjectName, `Subject ${index + 1}`),
    isOptional: asBoolean(record.isOptional, false),
    subjectType,
    category: category === 'Academic' || category === 'Non-Academic' ? category : null,
    description: asString(record.description),
    totalMarks: asNumber(record.maxMarks, 0),
    passingMarks: asNumber(record.passMarks, 0),
    isActive: !asBoolean(record.delStatus, false),
    createdDate: asString(record.addOnDt),
  }
}

export async function getSubjects(): Promise<SubjectRecord[]> {
  const response = await backendApi.get<SubjectApiRecord[]>('/Subject', {
    headers: {
      accept: '*/*',
    },
  })

  return Array.isArray(response.data) ? response.data.map(normalizeSubject) : []
}

export async function createSubject(payload: CreateSubjectPayload): Promise<void> {
  await backendApi.post('/Subject', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}

export async function updateSubject(payload: UpdateSubjectPayload): Promise<void> {
  await backendApi.put('/Subject', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteSubject(subjectId: number): Promise<void> {
  await backendApi.delete(`/Subject/${subjectId}`, {
    headers: {
      accept: '*/*',
    },
  })
}
