import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs'
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BookOpen, ChevronDown, LayoutGrid, Layers, Save, Users } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'

type ClassOption = {
  id: number
  name: string
}

export type SectionFormPayload = {
  sectionName: string
  classId: number
  roomNumber: string
  floor: string
  capacity: number
  classTeacher: string
}

type SectionUpsertModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  classOptions: ClassOption[]
  initialValues?: {
    sectionName: string
    classId: number
    roomNumber: string
    floor: string
    capacity: number
    classTeacher: string
  } | null
  onSubmit: (payload: SectionFormPayload) => void
}

export function SectionUpsertModal({
  open,
  onOpenChange,
  mode,
  classOptions,
  initialValues,
  onSubmit,
}: SectionUpsertModalProps) {
  const [sectionName, setSectionName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [floor, setFloor] = useState('')
  const [capacity, setCapacity] = useState('')
  const [classTeacher, setClassTeacher] = useState('')

  useEffect(() => {
    if (!open) return
    setSectionName(initialValues?.sectionName ?? '')
    setSelectedClassId(initialValues?.classId ? String(initialValues.classId) : '')
    setRoomNumber(initialValues?.roomNumber ?? '')
    setFloor(initialValues?.floor ?? '')
    setCapacity(initialValues?.capacity ? String(initialValues.capacity) : '')
    setClassTeacher(initialValues?.classTeacher ?? '')
  }, [initialValues, open])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const classId = Number.parseInt(selectedClassId, 10)
    if (Number.isNaN(classId)) return

    onSubmit({
      sectionName: sectionName.trim(),
      classId,
      roomNumber: roomNumber.trim(),
      floor: floor.trim(),
      capacity: Number.parseInt(capacity, 10) || 0,
      classTeacher: classTeacher.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/20 bg-white/95 p-6 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">{mode === 'edit' ? 'Edit Section' : 'Create New Section'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Section Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={sectionName}
                onChange={(event) => setSectionName(event.target.value)}
                placeholder="e.g. A, B, C"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Select Class <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedClassId}
                onChange={(event) => setSelectedClassId(event.target.value)}
                className="w-full appearance-none rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              >
                <option value="">Select Class</option>
                {classOptions.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Room Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  placeholder="101"
                  className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={floor}
                onChange={(event) => setFloor(event.target.value)}
                placeholder="1st Floor"
                className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Student Capacity <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                placeholder="30"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Class Teacher <span className="text-red-500">*</span>
            </label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.menuDisplayName}
              value={classTeacher}
              onChange={setClassTeacher}
              placeholder="Search teacher..."
              required
            />
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
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
            >
              <Save size={18} />
              {mode === 'edit' ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
