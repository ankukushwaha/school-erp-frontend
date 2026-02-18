import { useQuery } from '@tanstack/react-query'
import { getStudents } from '@/services/students'

export function useStudentsQuery() {
  return useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })
}
