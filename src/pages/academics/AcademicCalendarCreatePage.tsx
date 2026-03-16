import { ArrowLeft, Save } from 'lucide-react'
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs'
import { ROUTES } from '@/app/constants/routes'
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox'
import { useCreateAcademicCalendarMutation } from '@/hooks/useAcademicCalendarMutation'
import { useClassesQuery } from '@/hooks/useClassesQuery'
import { useSchoolQuery } from '@/hooks/useSchoolQuery'
import type { CommonSearchItem } from '@/services/commonSearch'
import { type FormEventHandler, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialSelectedClasses = ['All']

export function AcademicCalendarCreatePage() {
  const navigate = useNavigate()
  const { data: schools = [] } = useSchoolQuery()
  const { data: classes = [], isLoading: isClassesLoading, isError: isClassesError } = useClassesQuery()
  const createAcademicCalendarMutation = useCreateAcademicCalendarMutation()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [typeId, setTypeId] = useState<number | null>(null)
  const [academicYear, setAcademicYear] = useState('')
  const [academicYearId, setAcademicYearId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>(initialSelectedClasses)
  const [classSelectionError, setClassSelectionError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const classOptions = useMemo(() => classes.map((schoolClass) => schoolClass.name), [classes])
  const showClassSelection = !selectedClasses.includes('All')

  const handleAllClassesToggle = (checked: boolean) => {
    setClassSelectionError('')
    setSelectedClasses(checked ? initialSelectedClasses : [])
  }

  const handleClassToggle = (classOption: string, checked: boolean) => {
    setClassSelectionError('')
    setSelectedClasses((prev) => {
      const baseSelection = prev.includes('All') ? [] : prev
      if (checked) return [...baseSelection, classOption]
      return baseSelection.filter((item) => item !== classOption)
    })
  }

  const handleAcademicYearChange = (value: string) => {
    setAcademicYear(value)
    setAcademicYearId(null)
    setSubmitError('')
  }

  const handleAcademicYearSelect = (item: CommonSearchItem) => {
    const resolvedId = typeof item.id === 'number' ? item.id : Number(item.id)
    setAcademicYearId(Number.isNaN(resolvedId) ? null : resolvedId)
    setSubmitError('')
  }

  const handleEventTypeChange = (value: string) => {
    setType(value)
    setTypeId(null)
    setSubmitError('')
  }

  const handleEventTypeSelect = (item: CommonSearchItem) => {
    const resolvedId = typeof item.id === 'number' ? item.id : Number(item.id)
    setTypeId(Number.isNaN(resolvedId) ? null : resolvedId)
    setSubmitError('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setSubmitError('')
    const normalizedClasses = selectedClasses.includes('All') ? ['All'] : selectedClasses

    if (normalizedClasses.length === 0) {
      setClassSelectionError('Select at least one class or choose All Classes.')
      return
    }

    if (!academicYearId) {
      setSubmitError('Select a valid academic year from the search list.')
      return
    }

    if (!typeId) {
      setSubmitError('Select a valid event type from the search list.')
      return
    }

    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setSubmitError('End date cannot be earlier than start date.')
      return
    }

    const selectedClassRecords = classes.filter((schoolClass) => normalizedClasses.includes(schoolClass.name))
    if (!normalizedClasses.includes('All') && selectedClassRecords.length === 0) {
      setSubmitError('Select at least one valid class.')
      return
    }

    const schoolId = schools[0]?.schoolId ?? 1
    const requestClassIds = normalizedClasses.includes('All')
      ? [selectedClassRecords[0]?.id ?? classes[0]?.id ?? 1]
      : selectedClassRecords.map((schoolClass) => schoolClass.id)

    try {
      await Promise.all(
        requestClassIds.map((classId) =>
          createAcademicCalendarMutation.mutateAsync({
            academicYearId,
            schoolId,
            classId,
            isAllClasses: normalizedClasses.includes('All'),
            eventTypeId: typeId,
            eventTitle: title,
            eventDescription: description,
            startDate,
            endDate,
            isHoliday: type.trim().toLowerCase() === 'holiday',
          }),
        ),
      )
      navigate(ROUTES.acedmicCalendar)
    } catch {
      setSubmitError('Failed to create event. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.acedmicCalendar)}
          className="rounded-full bg-white/40 p-2 text-gray-600 transition-colors hover:bg-white/60"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Add New Event</h1>
          <p className="mt-1 text-sm text-gray-500">Create a new academic calendar event</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.academicYear}
              value={academicYear}
              onChange={handleAcademicYearChange}
              onSelect={handleAcademicYearSelect}
              placeholder="Search academic year..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Independence Day"
              className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Event Type <span className="text-red-500">*</span>
            </label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.eventType}
              value={type}
              onChange={handleEventTypeChange}
              onSelect={handleEventTypeSelect}
              placeholder="Search event type..."
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                min={startDate || undefined}
                className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Event description..."
              rows={3}
              className="w-full resize-none rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Applicable Classes</label>
            <div className="rounded-xl border border-white/30 bg-white/40 p-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedClasses.includes('All')}
                  onChange={(event) => handleAllClassesToggle(event.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">All Classes</span>
              </label>
            </div>

            {showClassSelection ? (
              <div className="rounded-xl border border-white/30 bg-white/40 p-4">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Select Classes <span className="text-red-500">*</span>
                </label>
                {isClassesLoading ? <p className="mt-3 text-sm text-gray-500">Loading classes...</p> : null}
                {isClassesError ? <p className="mt-3 text-sm text-red-600">Failed to load classes.</p> : null}
                {!isClassesLoading && !isClassesError && classOptions.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-500">No classes available.</p>
                ) : null}
                {!isClassesLoading && !isClassesError && classOptions.length > 0 ? (
                  <div className="mt-3 grid max-h-[200px] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                    {classOptions.map((classOption) => {
                      const isSelected = selectedClasses.includes(classOption)
                      return (
                        <label
                          key={classOption}
                          className={`flex items-center justify-between rounded-lg border p-3 text-sm transition-colors ${
                            isSelected
                              ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 bg-white/70 text-gray-700 hover:border-indigo-200'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(event) => handleClassToggle(classOption, event.target.checked)}
                              className="rounded"
                            />
                            {classOption}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}

            {classSelectionError ? <p className="text-xs text-red-600">{classSelectionError}</p> : null}
          </div>

          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.acedmicCalendar)}
              disabled={createAcademicCalendarMutation.isPending}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAcademicCalendarMutation.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
            >
              <Save size={18} />
              {createAcademicCalendarMutation.isPending ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
