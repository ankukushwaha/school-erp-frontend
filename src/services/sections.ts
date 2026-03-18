import { backendApi } from '@/services/backendApi'

export type CreateSectionPayload = {
  sectionName: string
  sectionCode: string
  authAdd: string
}

export async function createSection(payload: CreateSectionPayload): Promise<void> {
  await backendApi.post('/master/section', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  })
}
