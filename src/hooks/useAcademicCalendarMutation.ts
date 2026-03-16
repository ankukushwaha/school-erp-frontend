import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAcademicCalendar,
  type CreateAcademicCalendarPayload,
  getAcademicCalendar,
  deleteAcademicCalendar,
  updateAcademicCalendar,
  type UpdateAcademicCalendarPayload,
} from '@/services/academicCalendar'

export const academicCalendarQueryKey = ['academic-calendar']

export function useAcademicCalendarQuery() {
  return useQuery({
    queryKey: academicCalendarQueryKey,
    queryFn: getAcademicCalendar,
  })
}

export function useCreateAcademicCalendarMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAcademicCalendarPayload) => createAcademicCalendar(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: academicCalendarQueryKey })
    },
  })
}

export function useUpdateAcademicCalendarMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAcademicCalendarPayload) => updateAcademicCalendar(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: academicCalendarQueryKey })
    },
  })
}

export function useDeleteAcademicCalendarMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (academicCalendarId: number) => deleteAcademicCalendar(academicCalendarId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: academicCalendarQueryKey })
    },
  })
}
