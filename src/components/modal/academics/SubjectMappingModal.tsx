import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs'
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateSubjectMappingMutation, useUpdateSubjectMappingMutation } from '@/hooks/useSubjectMappingMutation'
import type { CommonSearchItem } from '@/services/commonSearch'
import type { SubjectMappingRecord } from '@/services/subjectMapping'
import { Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type FormState = {
  schoolId: number | null
  schoolName: string
  academicYearId: number | null
  academicYearName: string
  classId: number | null
  className: string
  sectionId: number
  applyToAllSections: boolean
  termId: number | null
  termName: string
  subjectId: number | null
  subjectName: string
  periodsPerWeek: string
  subjectType: string
}

type SubjectMappingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editRecord?: SubjectMappingRecord | null
}

const defaultForm: FormState = {
  schoolId: null,
  schoolName: '',
  academicYearId: null,
  academicYearName: '',
  classId: null,
  className: '',
  sectionId: 0,
  applyToAllSections: false,
  termId: null,
  termName: '',
  subjectId: null,
  subjectName: '',
  periodsPerWeek: '6',
  subjectType: 'mandatory',
}

function recordToForm(r: SubjectMappingRecord): FormState {
  return {
    schoolId: r.schoolId,
    schoolName: r.schoolName,
    academicYearId: r.academicYearId,
    academicYearName: r.academicYear,
    classId: r.classId,
    className: r.className,
    sectionId: r.sectionId,
    applyToAllSections: r.isAllSections,
    termId: r.termId,
    termName: r.termName,
    subjectId: r.subjectId,
    subjectName: r.subjectName,
    periodsPerWeek: String(r.periodsPerWeek),
    subjectType: r.subjectType || 'mandatory',
  }
}

export function SubjectMappingModal({ open, onOpenChange, editRecord }: SubjectMappingModalProps) {
  const isEdit = !!editRecord
  const [form, setForm] = useState<FormState>(defaultForm)
  const [error, setError] = useState('')

  const createMutation = useCreateSubjectMappingMutation()
  const updateMutation = useUpdateSubjectMappingMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!open) return
    setForm(editRecord ? recordToForm(editRecord) : defaultForm)
    setError('')
  }, [open, editRecord])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.schoolId || !form.academicYearId || !form.classId || !form.termId || !form.subjectId) {
      setError('Please select all required fields.')
      return
    }
    setError('')
    const payload = {
      academicYearId: form.academicYearId,
      schoolId: form.schoolId,
      classId: form.classId,
      sectionId: form.applyToAllSections ? 0 : form.sectionId,
      isAllSections: form.applyToAllSections,
      termId: form.termId,
      subjectId: form.subjectId,
      periodsPerWeek: Number(form.periodsPerWeek) || 0,
      subjectType: form.subjectType,
      authAdd: 'system',
    }
    try {
      if (isEdit && editRecord) {
        await updateMutation.mutateAsync({ ...payload, subjectMappingId: editRecord.subjectMappingId })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    } catch {
      setError('Failed to save mapping. Please try again.')
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-white/20 bg-white p-0 sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 sticky top-0 z-10">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Subject Mapping' : 'Map Subject to Class'}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* School + Academic Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>School <span className="text-red-500">*</span></label>
              <CommonSearchTextbox
                searchConfig={COMMON_SEARCH_CONFIGS.schoolName}
                value={form.schoolName}
                onChange={(value) => setForm((prev) => ({ ...prev, schoolName: value, schoolId: null }))}
                onSelect={(item: CommonSearchItem) => setForm((prev) => ({ ...prev, schoolId: Number(item.id), schoolName: item.label }))}
                placeholder="Search school..."
                required
              />
            </div>
            <div>
              <label className={labelClass}>Academic Year <span className="text-red-500">*</span></label>
              <CommonSearchTextbox
                searchConfig={COMMON_SEARCH_CONFIGS.academicYear}
                value={form.academicYearName}
                onChange={(value) => setForm((prev) => ({ ...prev, academicYearName: value, academicYearId: null }))}
                onSelect={(item: CommonSearchItem) => setForm((prev) => ({ ...prev, academicYearId: Number(item.id), academicYearName: item.label }))}
                placeholder="Search year..."
                required
              />
            </div>
          </div>

          {/* Class */}
          <div>
            <label className={labelClass}>Class <span className="text-red-500">*</span></label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.className}
              value={form.className}
              onChange={(value) => setForm((prev) => ({ ...prev, className: value, classId: null }))}
              onSelect={(item: CommonSearchItem) => setForm((prev) => ({ ...prev, classId: Number(item.id), className: item.label }))}
              placeholder="Search class..."
              required
            />
          </div>

          {/* Apply to All Sections */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="applyToAllSections"
              checked={form.applyToAllSections}
              onChange={(e) => setForm((prev) => ({ ...prev, applyToAllSections: e.target.checked, sectionId: 0 }))}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="applyToAllSections" className="text-sm text-gray-700 cursor-pointer">
              Apply to All Sections
            </label>
          </div>

          {/* Term */}
          <div>
            <label className={labelClass}>Term <span className="text-red-500">*</span></label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.termName}
              value={form.termName}
              onChange={(value) => setForm((prev) => ({ ...prev, termName: value, termId: null }))}
              onSelect={(item: CommonSearchItem) => setForm((prev) => ({ ...prev, termId: Number(item.id), termName: item.label }))}
              placeholder="Search term..."
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className={labelClass}>Subject <span className="text-red-500">*</span></label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.subjectName}
              value={form.subjectName}
              onChange={(value) => setForm((prev) => ({ ...prev, subjectName: value, subjectId: null }))}
              onSelect={(item: CommonSearchItem) => setForm((prev) => ({ ...prev, subjectId: Number(item.id), subjectName: item.label }))}
              placeholder="Search subject..."
              required
            />
          </div>

          {/* Periods Per Week */}
          <div>
            <label className={labelClass}>Periods Per Week <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={form.periodsPerWeek}
              onChange={(e) => setForm((prev) => ({ ...prev, periodsPerWeek: e.target.value }))}
              min="1"
              max="14"
              className={inputClass}
              required
            />
          </div>

          {/* Subject Type */}
          <div>
            <label className={labelClass}>Subject Type</label>
            <select
              value={form.subjectType}
              onChange={(e) => setForm((prev) => ({ ...prev, subjectType: e.target.value }))}
              className={inputClass}
            >
              <option value="mandatory">Mandatory</option>
              <option value="optional">Optional</option>
              <option value="elective">Elective</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              <Save size={16} />
              {isPending ? 'Saving...' : isEdit ? 'Update Mapping' : 'Save Mapping'}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
