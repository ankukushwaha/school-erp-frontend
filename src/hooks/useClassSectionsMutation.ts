import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createClassSection,
  deleteClassSection,
  type CreateClassSectionPayload,
  type DeleteClassSectionPayload,
  getClassSections,
  type UpdateClassSectionPayload,
  updateClassSection,
} from '@/services/classSections'

export const classSectionsQueryKey = ['class-sections']

export function useClassSectionsQuery() {
  return useQuery({
    queryKey: classSectionsQueryKey,
    queryFn: getClassSections,
  })
}

export function useCreateClassSectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateClassSectionPayload) => createClassSection(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classSectionsQueryKey })
    },
  })
}

export function useUpdateClassSectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateClassSectionPayload) => updateClassSection(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classSectionsQueryKey })
    },
  })
}

export function useDeleteClassSectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeleteClassSectionPayload) => deleteClassSection(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classSectionsQueryKey })
    },
  })
}
