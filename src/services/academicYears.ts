import { backendApi } from '@/services/backendApi'

export type Term = {
  id: number
  name: string
  startDate: string
  endDate: string
  workingDays: number
}

export type AcademicYearStatus = 'Active' | 'Upcoming' | 'Completed'

export type AcademicYear = {
  id: number
  yearName: string
  startDate: string
  endDate: string
  status: AcademicYearStatus
  terms: Term[]
}

type AcademicYearPayload = Omit<AcademicYear, 'id'>

type AcademicYearApiRecord = {
  id?: unknown
  academicYearId?: unknown
  academicYearName?: unknown
  yearName?: unknown
  name?: unknown
  startDate?: unknown
  endDate?: unknown
  isActive?: unknown
  status?: unknown
  terms?: unknown
}

type AcademicYearCreateRequest = {
  academicYearName: string
  startDate: string
  endDate: string
  terms: Array<{
    termId: number
    termName: string
    startDate: string
    endDate: string
    workingDays: number
  }>
}

type AcademicYearsApiResponse =
  | AcademicYearApiRecord[]
  | { data?: unknown; items?: unknown; result?: unknown; records?: unknown }

function asNumber(value: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return Date.now()
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asStatus(value: unknown): AcademicYearStatus {
  return value === 'Active' || value === 'Upcoming' || value === 'Completed' ? value : 'Upcoming'
}

function deriveStatus(record: AcademicYearApiRecord): AcademicYearStatus {
  if (record.isActive === true) return 'Active'

  const normalizedStatus = asStatus(record.status)
  if (record.status === 'Active' || record.status === 'Upcoming' || record.status === 'Completed') return normalizedStatus

  const endDate = new Date(asString(record.endDate))
  if (!Number.isNaN(endDate.getTime()) && endDate.getTime() < Date.now()) return 'Completed'
  return 'Upcoming'
}

function normalizeTerm(item: unknown, index: number): Term {
  const record = (item ?? {}) as Record<string, unknown>
  return {
    id: asNumber(record.id ?? record.termId ?? index + 1),
    name: asString(record.termName ?? record.name ?? `Term ${index + 1}`),
    startDate: asString(record.startDate),
    endDate: asString(record.endDate),
    workingDays: asNumber(record.workingDays ?? 0),
  }
}

function getItems(payload: AcademicYearsApiResponse): AcademicYearApiRecord[] {
  if (Array.isArray(payload)) return payload
  const data = payload.data ?? payload.items ?? payload.result ?? payload.records
  return Array.isArray(data) ? (data as AcademicYearApiRecord[]) : []
}

function normalizeAcademicYear(record: AcademicYearApiRecord): AcademicYear {
  const rawTerms = Array.isArray(record.terms) ? record.terms : []
  return {
    id: asNumber(record.id ?? record.academicYearId),
    yearName: asString(record.academicYearName ?? record.yearName ?? record.name),
    startDate: asString(record.startDate),
    endDate: asString(record.endDate),
    status: deriveStatus(record),
    terms: rawTerms.map((term, index) => normalizeTerm(term, index)),
  }
}

function toUtcIso(value: string): string {
  if (!value) return value
  if (value.includes('T')) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toISOString()
  }
  return new Date(`${value}T00:00:00Z`).toISOString()
}

function toCreateRequest(payload: AcademicYearPayload): AcademicYearCreateRequest {
  return {
    academicYearName: payload.yearName,
    startDate: toUtcIso(payload.startDate),
    endDate: toUtcIso(payload.endDate),
    terms: payload.terms.map((term) => ({
      termId: term.id,
      termName: term.name,
      startDate: toUtcIso(term.startDate),
      endDate: toUtcIso(term.endDate),
      workingDays: term.workingDays,
    })),
  }
}

function getSingleRecord(payload: unknown): AcademicYearApiRecord {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const candidate = payload as { data?: unknown; item?: unknown; result?: unknown }
    const nested = candidate.data ?? candidate.item ?? candidate.result
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return nested as AcademicYearApiRecord
    }
    return payload as AcademicYearApiRecord
  }
  return {}
}

export async function getAcademicYears(): Promise<AcademicYear[]> {
  const response = await backendApi.get<AcademicYearsApiResponse>('/master/academic-year')
  return getItems(response.data).map(normalizeAcademicYear)
}

export async function createAcademicYear(payload: AcademicYearPayload): Promise<AcademicYear> {
  const request = toCreateRequest(payload)
  const response = await backendApi.post('/master/academic-year', request)
  return normalizeAcademicYear(getSingleRecord(response.data))
}

export async function updateAcademicYear(id: number, payload: AcademicYearPayload): Promise<AcademicYear> {
  const response = await backendApi.put<AcademicYear>(`/academic-years/${id}`, payload)
  return response.data
}

export async function removeAcademicYear(id: number): Promise<void> {
  await backendApi.delete(`/academic-years/${id}`)
}
