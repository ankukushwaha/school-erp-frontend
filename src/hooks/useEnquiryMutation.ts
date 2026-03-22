import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createEnquiry, type CreateEnquiryPayload, getEnquiries, updateEnquiry, type UpdateEnquiryPayload } from '@/services/enquiry'

export const enquiriesQueryKey = ['enquiries']

export function useEnquiriesQuery() {
  return useQuery({
    queryKey: enquiriesQueryKey,
    queryFn: getEnquiries,
  })
}

export function useCreateEnquiryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEnquiryPayload) => createEnquiry(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enquiriesQueryKey })
    },
  })
}

export function useUpdateEnquiryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateEnquiryPayload) => updateEnquiry(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enquiriesQueryKey })
    },
  })
}
