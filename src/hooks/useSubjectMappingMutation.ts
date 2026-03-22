import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSubjectMapping, type CreateSubjectMappingPayload, deleteSubjectMapping, getSubjectMappings, updateSubjectMapping, type UpdateSubjectMappingPayload } from '@/services/subjectMapping'

export const subjectMappingsQueryKey = ['subjectMappings']

export function useSubjectMappingsQuery() {
  return useQuery({
    queryKey: subjectMappingsQueryKey,
    queryFn: getSubjectMappings,
  })
}

export function useCreateSubjectMappingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSubjectMappingPayload) => createSubjectMapping(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subjectMappingsQueryKey })
    },
  })
}

export function useUpdateSubjectMappingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateSubjectMappingPayload) => updateSubjectMapping(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subjectMappingsQueryKey })
    },
  })
}

export function useDeleteSubjectMappingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (subjectMappingId: number) => deleteSubjectMapping(subjectMappingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subjectMappingsQueryKey })
    },
  })
}
