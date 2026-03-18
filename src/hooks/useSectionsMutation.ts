import { useMutation } from '@tanstack/react-query'
import { createSection, type CreateSectionPayload } from '@/services/sections'

export function useCreateSectionMutation() {
  return useMutation({
    mutationFn: (payload: CreateSectionPayload) => createSection(payload),
  })
}
