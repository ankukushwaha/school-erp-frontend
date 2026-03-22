import { backendApi } from '@/services/backendApi'

export type EnquiryRecord = {
  enquiryId: number
  id: string
  studentName: string
  parentName: string
  email: string
  phone: string
  classApplying: string
  enquiryDate: string
  followUpDate?: string
  status: string
  priority: string
  source: string
  assignedTo?: string
  notes?: string
  address?: string
  previousSchool?: string
}

type ApiRecord = Record<string, unknown>

function asStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

function asNum(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') { const p = Number(v); if (!Number.isNaN(p)) return p }
  return fallback
}

function normalize(r: ApiRecord, index: number): EnquiryRecord {
  return {
    enquiryId: asNum(r.enquiryId ?? r.id, 0),
    id: asStr(r.enquiryNo ?? r.enquiryId ?? r.id, `ENQ${index + 1}`),
    studentName: asStr(r.studentName),
    parentName: asStr(r.parentName),
    email: asStr(r.studentEmail ?? r.parentEmail),
    phone: asStr(r.studentMobile ?? r.parentMobile),
    classApplying: asStr(r.classApplying ?? r.className),
    enquiryDate: asStr(r.enquiryDate),
    followUpDate: r.followupDate ? asStr(r.followupDate) : undefined,
    status: asStr(r.status, 'new').toLowerCase().replace(/ /g, '-'),
    priority: asStr(r.priority, 'medium').toLowerCase(),
    source: asStr(r.source),
    assignedTo: r.assignedToName ? asStr(r.assignedToName) : undefined,
    notes: r.notes ? asStr(r.notes) : undefined,
    address: r.address ? asStr(r.address) : undefined,
    previousSchool: r.previousSchool ? asStr(r.previousSchool) : undefined,
  }
}

export async function getEnquiries(): Promise<EnquiryRecord[]> {
  const response = await backendApi.get<unknown>('/Enquiry', {
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

export type CreateEnquiryPayload = {
  enquiryNo: string
  studentName: string
  studentMobile: string
  studentEmail: string
  parentName: string
  parentMobile: string
  parentEmail: string
  previousSchool: string
  occupation: string
  address: string
  city: string
  districtId: number
  stateId: number
  pincode: string
  source: string
  priority: string
  assignedTo: number
  followupDate: string
  notes: string
  authAdd: string
}

export async function createEnquiry(payload: CreateEnquiryPayload): Promise<void> {
  await backendApi.post('/Enquiry', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
}

export type UpdateEnquiryPayload = CreateEnquiryPayload & { enquiryId: number; authLstEdt: string }

export async function updateEnquiry(payload: UpdateEnquiryPayload): Promise<void> {
  await backendApi.put('/Enquiry', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
}
