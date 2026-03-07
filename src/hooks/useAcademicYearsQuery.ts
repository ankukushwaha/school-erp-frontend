import {
  createAcademicYear,
  getAcademicYears,
  removeAcademicYear,
  updateAcademicYear,
  type AcademicYear,
} from '@/services/academicYears'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const academicYearsQueryKey = ['academic-years']

export function useAcademicYearsQuery() {
  return useQuery({
    queryKey: academicYearsQueryKey,
    queryFn: getAcademicYears,
  })
}

export function useCreateAcademicYearMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<AcademicYear, 'id'>) => createAcademicYear(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: academicYearsQueryKey })
    },
  })
}

export function useUpdateAcademicYearMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Omit<AcademicYear, 'id'> }) => updateAcademicYear(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: academicYearsQueryKey })
    },
  })
}

export function useDeleteAcademicYearMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => removeAcademicYear(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: academicYearsQueryKey })
    },
  })
}
