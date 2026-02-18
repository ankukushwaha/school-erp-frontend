import { useStudentsQuery } from '@/hooks/useStudentsQuery'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMemo, useState } from 'react'

export function StudentsPage() {
  const { data: students, isLoading, isError, error } = useStudentsQuery()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = useMemo(() => {
    if (!students) return []

    const term = searchTerm.trim().toLowerCase()
    if (!term) return students

    return students.filter(
      (student) => student.name.toLowerCase().includes(term) || student.email.toLowerCase().includes(term),
    )
  }, [students, searchTerm])

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Students</h1>
      <div className="max-w-sm">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email"
        />
      </div>

      {isLoading ? <p className="text-sm text-slate-600">Loading students...</p> : null}

      {isError ? (
        <p className="text-sm text-red-600">
          Failed to load students: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      ) : null}

      {!isLoading && !isError && students && students.length === 0 ? (
        <p className="text-sm text-slate-600">No students found.</p>
      ) : null}

      {!isLoading && !isError && students && students.length > 0 && filteredStudents.length === 0 ? (
        <p className="text-sm text-slate-600">No matching students for "{searchTerm}".</p>
      ) : null}

      {!isLoading && !isError && filteredStudents.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  )
}
