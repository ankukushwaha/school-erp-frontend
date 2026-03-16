import { backendApi } from '@/services/backendApi'

export type CreateAcademicCalendarPayload = {
  academicYearId: number
  schoolId: number
  classId: number
  isAllClasses: boolean
  eventTypeId: number
  eventTitle: string
  eventDescription: string
  startDate: string
  endDate: string
  isHoliday: boolean
}

export type UpdateAcademicCalendarPayload = CreateAcademicCalendarPayload & {
  academicCalendarId: number
}

export type AcademicCalendarRecord = {
  id?: unknown
  academicCalendarId?: unknown
  academicYearId?: unknown
  academicYearName?: unknown
  schoolId?: unknown
  classId?: unknown
  className?: unknown
  isAllClasses?: unknown
  eventTypeId?: unknown
  eventTypeName?: unknown
  eventTitle?: unknown
  eventDescription?: unknown
  startDate?: unknown
  endDate?: unknown
  isHoliday?: unknown
}

type AcademicCalendarApiResponse =
  | AcademicCalendarRecord[]
  | { data?: unknown; items?: unknown; result?: unknown; records?: unknown }

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return fallback
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function toUtcIso(value: string): string {
  if (!value) return value
  if (value.includes('T')) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toISOString()
  }
  return new Date(`${value}T00:00:00Z`).toISOString()
}

function getRecordId(payload: unknown): number {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const candidate = payload as { data?: unknown; item?: unknown; result?: unknown }
    const nested = (candidate.data ?? candidate.item ?? candidate.result ?? payload) as AcademicCalendarRecord
    return asNumber(nested.academicCalendarId ?? nested.id)
  }
  return 0
}

function getItems(payload: AcademicCalendarApiResponse): AcademicCalendarRecord[] {
  if (Array.isArray(payload)) return payload
  const data = payload.data ?? payload.items ?? payload.result ?? payload.records
  return Array.isArray(data) ? (data as AcademicCalendarRecord[]) : []
}

export async function getAcademicCalendar(): Promise<Array<{
  academicCalendarId: number
  academicYearId: number
  academicYearName: string
  schoolId: number
  classId: number
  className: string
  isAllClasses: boolean
  eventTypeId: number
  eventTypeName: string
  eventTitle: string
  eventDescription: string
  startDate: string
  endDate: string
  isHoliday: boolean
}>> {
  const response = await backendApi.get<AcademicCalendarApiResponse>('/AcademicCalendar', {
    headers: {
      accept: '*/*',
    },
  })

  return getItems(response.data).map((record) => ({
    academicCalendarId: asNumber(record.academicCalendarId ?? record.id),
    academicYearId: asNumber(record.academicYearId),
    academicYearName: asString(record.academicYearName),
    schoolId: asNumber(record.schoolId),
    classId: asNumber(record.classId),
    className: asString(record.className),
    isAllClasses: asBoolean(record.isAllClasses),
    eventTypeId: asNumber(record.eventTypeId),
    eventTypeName: asString(record.eventTypeName),
    eventTitle: asString(record.eventTitle),
    eventDescription: asString(record.eventDescription),
    startDate: asString(record.startDate),
    endDate: asString(record.endDate),
    isHoliday: asBoolean(record.isHoliday),
  }))
}

function toRequestBody(payload: CreateAcademicCalendarPayload | UpdateAcademicCalendarPayload) {
  return {
    ...payload,
    startDate: toUtcIso(payload.startDate),
    endDate: toUtcIso(payload.endDate),
  }
}

export async function createAcademicCalendar(payload: CreateAcademicCalendarPayload): Promise<number> {
  const response = await backendApi.post(
    '/AcademicCalendar',
    toRequestBody(payload),
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    },
  )
  return getRecordId(response.data)
}

export async function updateAcademicCalendar(payload: UpdateAcademicCalendarPayload): Promise<void> {
  await backendApi.put('/AcademicCalendar', toRequestBody(payload), {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteAcademicCalendar(academicCalendarId: number): Promise<void> {
  await backendApi.delete(`/AcademicCalendar/${academicCalendarId}`, {
    headers: {
      accept: '*/*',
    },
  })
}
