import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSchools, updateSchool, type UpdateSchoolPayload } from '@/services/school'

export const schoolQueryKey = ['schools']

export function useSchoolQuery() {
  return useQuery({
    queryKey: schoolQueryKey,
    queryFn: getSchools,
  })
}

export function useUpdateSchoolMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateSchoolPayload) => updateSchool(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schoolQueryKey })
    },
  })
}
