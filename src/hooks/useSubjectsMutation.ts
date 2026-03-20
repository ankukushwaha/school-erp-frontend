import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSubject, deleteSubject, getSubjects, updateSubject, type CreateSubjectPayload, type UpdateSubjectPayload } from '@/services/subjects'

export const subjectsQueryKey = ['subjects']

export function useSubjectsQuery() {
  return useQuery({
    queryKey: subjectsQueryKey,
    queryFn: getSubjects,
  })
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => createSubject(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subjectsQueryKey })
    },
  })
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateSubjectPayload) => updateSubject(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subjectsQueryKey })
    },
  })
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (subjectId: number) => deleteSubject(subjectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subjectsQueryKey })
    },
  })
}
