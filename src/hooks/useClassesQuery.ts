import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClass, type CreateClassPayload, deleteClass, getClasses, type UpdateClassPayload, updateClass } from '@/services/classes'

export const classesQueryKey = ['classes']

export function useClassesQuery() {
  return useQuery({
    queryKey: classesQueryKey,
    queryFn: getClasses,
  })
}

export function useCreateClassMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateClassPayload) => createClass(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classesQueryKey })
    },
  })
}

export function useUpdateClassMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateClassPayload) => updateClass(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classesQueryKey })
    },
  })
}

export function useDeleteClassMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (classId: number) => deleteClass(classId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classesQueryKey })
    },
  })
}
