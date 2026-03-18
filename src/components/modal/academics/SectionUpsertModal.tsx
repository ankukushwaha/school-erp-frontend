import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs'
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { CommonSearchItem } from '@/services/commonSearch'
import { ChevronDown, Info, LayoutGrid, Save, Users } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'

export type SectionFormPayload = {
  classSectionId?: number
  classId: number
  className: string
  sectionId: number
  sectionName: string
  roomNumber: string
  floor: string
  sectionCapacity: number
  classTeacherId: number
  classTeacherName: string
  authValue: string
}

type SectionUpsertModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialValues?: {
    classSectionId?: number
    classId: number
    className: string
    sectionId: number
    sectionName: string
    roomNumber: string
    floor: string
    sectionCapacity: number
    classTeacherId: number
    classTeacherName: string
    authValue: string
  } | null
  onSubmit: (payload: SectionFormPayload) => Promise<void> | void
}

export function SectionUpsertModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
}: SectionUpsertModalProps) {
  const floorOptions = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor']
  const [className, setClassName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [sectionName, setSectionName] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null)
  const [roomNumber, setRoomNumber] = useState('')
  const [floor, setFloor] = useState('')
  const [sectionCapacity, setSectionCapacity] = useState('')
  const [classTeacherName, setClassTeacherName] = useState('')
  const [classTeacherId, setClassTeacherId] = useState<number | null>(null)
  const [authValue, setAuthValue] = useState('')

  useEffect(() => {
    if (!open) return
    setClassName(initialValues?.className ?? '')
    setSelectedClassId(initialValues?.classId ?? null)
    setSectionName(initialValues?.sectionName ?? '')
    setSelectedSectionId(initialValues?.sectionId ?? null)
    setRoomNumber(initialValues?.roomNumber ?? '')
    setFloor(initialValues?.floor ?? '')
    setSectionCapacity(initialValues?.sectionCapacity ? String(initialValues.sectionCapacity) : '')
    setClassTeacherName(initialValues?.classTeacherName ?? '')
    setClassTeacherId(initialValues?.classTeacherId ?? null)
    setAuthValue(mode === 'edit' ? '444' : '555')
  }, [initialValues, mode, open])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!selectedClassId || !selectedSectionId || !classTeacherId) return

    await onSubmit({
      classSectionId: initialValues?.classSectionId,
      sectionName: sectionName.trim(),
      sectionId: selectedSectionId,
      classId: selectedClassId,
      className: className.trim(),
      roomNumber: roomNumber.trim(),
      floor: floor.trim(),
      sectionCapacity: Number.parseInt(sectionCapacity, 10) || 0,
      classTeacherId,
      classTeacherName: classTeacherName.trim(),
      authValue: authValue.trim() || (mode === 'edit' ? '444' : '555'),
    })
    onOpenChange(false)
  }

  const handleClassSelect = (item: CommonSearchItem) => {
    setSelectedClassId(Number(item.id))
    setClassName(item.label)
  }

  const handleSectionSelect = (item: CommonSearchItem) => {
    setSelectedSectionId(Number(item.id))
    setSectionName(item.label)
  }

  const handleTeacherSelect = (item: CommonSearchItem) => {
    setClassTeacherId(Number(item.id))
    setClassTeacherName(item.label)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-white/20 bg-white/95 p-0 sm:rounded-2xl">
        <DialogHeader>
          <div className="rounded-t-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-6 py-5">
            <DialogTitle className="text-2xl font-bold text-white">{mode === 'edit' ? 'Edit Section' : 'Add New Section'}</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Select Class <span className="text-red-500">*</span>
            </label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.className}
              value={className}
              onChange={(value) => {
                setClassName(value)
                setSelectedClassId(null)
              }}
              onSelect={handleClassSelect}
              placeholder="Choose a class..."
              required
            />
            <p className="text-xs text-slate-500">Select the class to which this section belongs</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Section Name <span className="text-red-500">*</span>
            </label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.sectionName}
              value={sectionName}
              onChange={(value) => {
                setSectionName(value)
                setSelectedSectionId(null)
              }}
              onSelect={handleSectionSelect}
              placeholder="e.g., Section A, Section B"
              required
            />
            <p className="text-xs text-slate-500">Section code will be auto-generated</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Room Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  placeholder="e.g., 101, 202"
                  className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Floor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={floor}
                  onChange={(event) => setFloor(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                >
                  <option value="">Select floor...</option>
                  {floorOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Section Capacity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  value={sectionCapacity}
                  onChange={(event) => setSectionCapacity(event.target.value)}
                  placeholder="e.g., 30"
                  className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Class Teacher</label>
              <CommonSearchTextbox
                searchConfig={COMMON_SEARCH_CONFIGS.teacherName}
                value={classTeacherName}
                onChange={(value) => {
                  setClassTeacherName(value)
                  setClassTeacherId(null)
                }}
                onSelect={handleTeacherSelect}
                placeholder="e.g., Mrs. Smith"
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Important Note:</p>
                <p className="mt-1">The section code will be automatically generated based on the class code and section name.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-fuchsia-600/30 transition-all hover:from-violet-700 hover:to-fuchsia-700"
            >
              <Save size={18} />
              Save Section
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
