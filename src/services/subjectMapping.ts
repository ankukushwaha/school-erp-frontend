import { backendApi } from '@/services/backendApi'

export type SubjectMappingRecord = {
  subjectMappingId: number
  classId: number
  className: string
  classCode: string
  sectionId: number
  sectionName: string
  isAllSections: boolean
  termId: number
  termName: string
  subjectId: number
  subjectName: string
  subjectCode: string
  subjectType: string
  periodsPerWeek: number
  academicYearId: number
  academicYear: string
  schoolId: number
  schoolName: string
}

export type CreateSubjectMappingPayload = {
  academicYearId: number
  schoolId: number
  classId: number
  sectionId: number
  isAllSections: boolean
  termId: number
  subjectId: number
  periodsPerWeek: number
  subjectType: string
  authAdd: string
}

type ApiRecord = Record<string, unknown>

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
  return fallback
}

function normalize(r: ApiRecord, index: number): SubjectMappingRecord {
  return {
    subjectMappingId: asNumber(r.subjectMappingId ?? r.id, index + 1),
    classId: asNumber(r.classId),
    className: asString(r.className ?? r.class),
    classCode: asString(r.classCode),
    sectionId: asNumber(r.sectionId),
    sectionName: asString(r.sectionName ?? r.section),
    isAllSections: asBoolean(r.isAllSections),
    termId: asNumber(r.termId),
    termName: asString(r.termName ?? r.term),
    subjectId: asNumber(r.subjectId),
    subjectName: asString(r.subjectName ?? r.subject),
    subjectCode: asString(r.subjectCode),
    subjectType: asString(r.subjectType),
    periodsPerWeek: asNumber(r.periodsPerWeek),
    academicYearId: asNumber(r.academicYearId),
    academicYear: asString(r.academicYear ?? r.academicYearName),
    schoolId: asNumber(r.schoolId),
    schoolName: asString(r.schoolName ?? r.school),
  }
}

export async function getSubjectMappings(): Promise<SubjectMappingRecord[]> {
  const response = await backendApi.get<unknown>('/SubjectMapping', {
    headers: { accept: '*/*' },
  })
  const data = response.data
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as ApiRecord)?.data)
      ? ((data as ApiRecord).data as ApiRecord[])
      : []
  return items.map((item, i) => normalize(item as ApiRecord, i))
}

export type UpdateSubjectMappingPayload = CreateSubjectMappingPayload & { subjectMappingId: number }

export async function createSubjectMapping(payload: CreateSubjectMappingPayload): Promise<void> {
  await backendApi.post('/SubjectMapping', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function updateSubjectMapping({ subjectMappingId, ...payload }: UpdateSubjectMappingPayload): Promise<void> {
  await backendApi.put(`/SubjectMapping/${subjectMappingId}`, payload, {
    headers: { accept: '*/*', 'Content-Type': 'application/json' },
  })
}

export async function deleteSubjectMapping(subjectMappingId: number): Promise<void> {
  await backendApi.delete(`/SubjectMapping/${subjectMappingId}`, {
    params: { deletedBy: 'system' },
    headers: { accept: '*/*' },
  })
}
