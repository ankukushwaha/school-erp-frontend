import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Download,
  Edit2,
  FileText,
  Flag,
  GraduationCap,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useAcademicCalendarQuery, useDeleteAcademicCalendarMutation } from '@/hooks/useAcademicCalendarMutation'
import { AcademicCalendarEventModal } from '@/components/modal/academics/AcademicCalendarEventModal'
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal'
import { type ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export type CalendarEvent = {
  id: number
  title: string
  type: string
  typeId?: number | null
  academicYear: string
  academicYearId?: number | null
  schoolId?: number
  className: string
  classIds?: number[]
  startDate: string
  endDate: string
  description: string
  classes: string[]
}

const eventTypes = ['Holiday', 'Exam', 'Event', 'Meeting', 'Sports']

const eventTypeStyles: Record<string, { badge: string; icon: ReactNode }> = {
  Holiday: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    icon: <Flag size={18} />,
  },
  Exam: {
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: <FileText size={18} />,
  },
  Event: {
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Calendar size={18} />,
  },
  Meeting: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <GraduationCap size={18} />,
  },
  Sports: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Flag size={18} />,
  },
}

const summaryCards = [
  { type: 'Holiday', label: 'Holidays', icon: <Flag size={20} />, iconClassName: 'bg-red-100 text-red-600' },
  { type: 'Exam', label: 'Exams', icon: <FileText size={20} />, iconClassName: 'bg-indigo-100 text-indigo-600' },
  { type: 'Event', label: 'Events', icon: <Calendar size={20} />, iconClassName: 'bg-purple-100 text-purple-600' },
  { type: 'Meeting', label: 'Meetings', icon: <GraduationCap size={20} />, iconClassName: 'bg-emerald-100 text-emerald-600' },
  { type: 'Sports', label: 'Sports', icon: <Flag size={20} />, iconClassName: 'bg-amber-100 text-amber-600' },
] as const

function getDefaultEventStyle() {
  return {
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <Calendar size={18} />,
  }
}

const getTypeColor = (type: string) => {
  return eventTypeStyles[type]?.badge ?? getDefaultEventStyle().badge
}

const getTypeIcon = (type: string) => {
  return eventTypeStyles[type]?.icon ?? getDefaultEventStyle().icon
}

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (start === end) {
    return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function buildGroupedEvents(academicCalendar: ReturnType<typeof useAcademicCalendarQuery>['data'] = []): CalendarEvent[] {
  const groupedEvents = new Map<string, CalendarEvent>()

  academicCalendar.forEach((record) => {
    const groupKey = [
      record.academicYearId,
      record.schoolId,
      record.eventTypeId,
      record.eventTitle,
      record.eventDescription,
      record.startDate,
      record.endDate,
      record.isAllClasses ? 'all' : 'selected',
    ].join('|')

    const existingEvent = groupedEvents.get(groupKey)
    if (existingEvent) {
      if (!record.isAllClasses && !existingEvent.classes.includes(record.className)) {
        existingEvent.classes.push(record.className)
      }
      if (!record.isAllClasses && !existingEvent.classIds?.includes(record.classId)) {
        existingEvent.classIds = [...(existingEvent.classIds ?? []), record.classId]
      }
      return
    }

    groupedEvents.set(groupKey, {
      id: record.academicCalendarId,
      title: record.eventTitle,
      type: record.eventTypeName,
      typeId: record.eventTypeId,
      academicYear: record.academicYearName,
      academicYearId: record.academicYearId,
      schoolId: record.schoolId,
      className: record.isAllClasses ? 'All' : record.className,
      classIds: [record.classId],
      startDate: record.startDate,
      endDate: record.endDate,
      description: record.eventDescription,
      classes: record.isAllClasses ? ['All'] : [record.className],
    })
  })

  return Array.from(groupedEvents.values()).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}

export function AcedmicCalendarPage() {
  const navigate = useNavigate()
  const { data: academicCalendar = [], isLoading: isAcademicCalendarLoading, isError: isAcademicCalendarError } = useAcademicCalendarQuery()
  const deleteAcademicCalendarMutation = useDeleteAcademicCalendarMutation()

  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const openCreateModal = () => {
    setEditingEvent(null)
    setShowEventModal(true)
  }

  const openEditModal = (evt: CalendarEvent) => {
    setEditingEvent(evt)
    setShowEventModal(true)
  }

  const openDeleteModal = (evt: CalendarEvent) => {
    setEventToDelete(evt)
    setIsDeleteModalOpen(true)
  }

  const deleteEvent = async () => {
    if (!eventToDelete) return
    await deleteAcademicCalendarMutation.mutateAsync(eventToDelete.id)
    setEventToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const events = useMemo(() => buildGroupedEvents(academicCalendar), [academicCalendar])

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || evt.type === filterType
      return matchesSearch && matchesType
    })
  }, [events, filterType, searchTerm])

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/academics')}
            className="rounded-full bg-white/40 p-2 text-gray-600 transition-colors hover:bg-white/60"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">Academic Calendar</h1>
            <p className="mt-1 text-sm text-gray-500">Manage holidays, events, exams, and meetings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-white">
            <Download size={18} />
            Export PDF
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.type} className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClassName}`}>{card.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-800">{events.filter((item) => item.type === card.type).length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search events by title or description..."
            className="w-full rounded-xl border border-white/30 bg-white/50 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
            className="min-w-[200px] appearance-none rounded-xl border border-white/30 bg-white/50 py-3 pl-4 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Types</option>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="space-y-4">
        {isAcademicCalendarLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white/40 p-10 text-center shadow-lg backdrop-blur-xl">
            <p className="text-sm text-gray-500">Loading academic calendar...</p>
          </div>
        ) : null}
        {isAcademicCalendarError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-10 text-center shadow-lg backdrop-blur-xl">
            <p className="text-sm text-red-600">Failed to load academic calendar.</p>
          </div>
        ) : null}
        {!isAcademicCalendarLoading && !isAcademicCalendarError && filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/40 p-10 text-center shadow-lg backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Calendar size={24} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">No events yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first academic calendar event to see it here.</p>
          </div>
        ) : null}
        {!isAcademicCalendarLoading && !isAcademicCalendarError
          ? filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`rounded-2xl border-2 ${getTypeColor(evt.type)} bg-white/40 p-6 shadow-lg transition-all hover:bg-white/60 backdrop-blur-xl`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getTypeColor(evt.type)}`}>
                    {getTypeIcon(evt.type)}
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-gray-800">{evt.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDateRange(evt.startDate, evt.endDate)}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(evt.type)}`}>{evt.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(evt)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-indigo-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(evt)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="mb-3 text-sm text-gray-600">{evt.description}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-500">Applicable to:</span>
                {evt.classes.map((cls) => (
                  <span key={cls} className="rounded-md bg-white/60 px-2 py-1 text-gray-700">
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          ))
          : null}
      </div>

      <AcademicCalendarEventModal
        open={showEventModal}
        onOpenChange={(open) => {
          setShowEventModal(open)
          if (!open) setEditingEvent(null)
        }}
        editingEvent={editingEvent}
      />

      <ConfirmActionModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open)
          if (!open) setEventToDelete(null)
        }}
        title="Delete Event"
        description={`Are you sure you want to delete ${eventToDelete?.title ?? 'this event'}?`}
        confirmLabel={deleteAcademicCalendarMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={deleteEvent}
      />
    </div>
  )
}
