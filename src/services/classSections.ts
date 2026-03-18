import { backendApi } from '@/services/backendApi'

export type ClassSectionRecord = {
  classSectionId?: unknown
  classId?: unknown
  className?: unknown
  sectionId?: unknown
  sectionName?: unknown
  roomNumber?: unknown
  floor?: unknown
  sectionCapacity?: unknown
  classTeacherId?: unknown
  classSectionCode?: unknown
}

export type ClassSection = {
  classSectionId: number
  classId: number
  className: string
  sectionId: number
  sectionName: string
  roomNumber: string
  floor: string
  sectionCapacity: number
  classTeacherId: number
  classSectionCode: string
}

export type CreateClassSectionPayload = {
  classId: number
  sectionId: number
  roomNumber: string
  floor: string
  sectionCapacity: number
  classTeacherId: number
  authAdd: string
}

export type UpdateClassSectionPayload = {
  classSectionId: number
  classId: number
  sectionId: number
  roomNumber: string
  floor: string
  sectionCapacity: number
  classTeacherId: number
  authLstEdt: string
}

export type DeleteClassSectionPayload = {
  classSectionId: number
  deletedBy: string
}

type ClassSectionsApiResponse =
  | ClassSectionRecord[]
  | { data?: unknown; items?: unknown; result?: unknown; records?: unknown }

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

function getItems(payload: ClassSectionsApiResponse): ClassSectionRecord[] {
  if (Array.isArray(payload)) return payload
  const data = payload.data ?? payload.items ?? payload.result ?? payload.records
  return Array.isArray(data) ? (data as ClassSectionRecord[]) : []
}

function normalizeClassSection(record: ClassSectionRecord, index: number): ClassSection {
  return {
    classSectionId: asNumber(record.classSectionId, index + 1),
    classId: asNumber(record.classId, 0),
    className: asString(record.className, `Class ${index + 1}`),
    sectionId: asNumber(record.sectionId, 0),
    sectionName: asString(record.sectionName, `Section ${index + 1}`),
    roomNumber: asString(record.roomNumber),
    floor: asString(record.floor),
    sectionCapacity: asNumber(record.sectionCapacity, 0),
    classTeacherId: asNumber(record.classTeacherId, 0),
    classSectionCode: asString(record.classSectionCode),
  }
}

export async function getClassSections(): Promise<ClassSection[]> {
  const response = await backendApi.get<ClassSectionsApiResponse>('/master/class-section', {
    headers: {
      accept: '*/*',
    },
  })

  return getItems(response.data).map(normalizeClassSection)
}

export async function createClassSection(payload: CreateClassSectionPayload): Promise<void> {
  await backendApi.post('/master/class-section', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}

export async function updateClassSection(payload: UpdateClassSectionPayload): Promise<void> {
  await backendApi.put('/master/class-section', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteClassSection(payload: DeleteClassSectionPayload): Promise<void> {
  await backendApi.delete(`/master/class-section/${payload.classSectionId}`, {
    headers: {
      accept: '*/*',
    },
    params: {
      deletedBy: payload.deletedBy,
    },
  })
}
