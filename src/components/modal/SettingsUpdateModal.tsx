import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SchoolRecord, UpdateSchoolPayload } from '@/services/school'
import { Camera } from 'lucide-react'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

type SettingsUpdateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSchool: SchoolRecord | null
  onUpdate: (payload: UpdateSchoolPayload) => Promise<void> | void
  isUpdating?: boolean
}

function getLogoSrc(school: SchoolRecord | null): string | null {
  if (!school?.logo) return null
  if (school.logo.startsWith('http://') || school.logo.startsWith('https://') || school.logo.startsWith('data:')) {
    return school.logo
  }
  const logoType = school.logoType || 'image/jpeg'
  return `data:${logoType};base64,${school.logo}`
}

export function SettingsUpdateModal({ open, onOpenChange, initialSchool, onUpdate, isUpdating = false }: SettingsUpdateModalProps) {
  const [form, setForm] = useState<SchoolRecord | null>(initialSchool)
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setForm(initialSchool ? { ...initialSchool } : null)
    setSelectedLogoFile(null)
  }, [initialSchool, open])

  const logoSrc = useMemo(() => getLogoSrc(form), [form])
  const initial = (form?.schoolName?.trim()?.charAt(0) || 'S').toUpperCase()

  const updateField = (field: keyof SchoolRecord, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setForm((prev) =>
        prev
          ? {
              ...prev,
              logo: result,
              logoName: file.name,
              logoType: file.type || 'image/jpeg',
            }
          : prev,
      )
      setSelectedLogoFile(file)
    }
    reader.readAsDataURL(file)
  }

  const handleUpdate = async () => {
    if (!form) return
    await onUpdate({
      schoolId: form.schoolId,
      schoolCode: form.schoolCode,
      schoolName: form.schoolName,
      principalName: form.principalName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
      city: form.city,
      state: form.state,
      country: form.country,
      postalCode: form.postalCode,
      logoFile: selectedLogoFile,
      logo: form.logo,
      logoName: form.logoName,
      logoType: form.logoType,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-white/20 bg-white/95 p-6 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit School Profile</DialogTitle>
          <DialogDescription>Update school details and logo.</DialogDescription>
        </DialogHeader>

        {!form ? (
          <p className="text-sm text-gray-500">No school data available.</p>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
              <div className="group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-600 shadow-md">
                  {logoSrc ? <img src={logoSrc} alt={form.logoName || 'School logo'} className="h-full w-full object-cover" /> : initial}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="text-white" size={24} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800">School Logo</h3>
                <p className="mt-1 text-sm text-gray-500">Recommended size: 512x512px (PNG, JPG)</p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('logo', '')}
                    className="rounded-lg border border-transparent bg-transparent px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleLogoChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">School Name</label>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={(event) => updateField('schoolName', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Principal Name</label>
                <input
                  type="text"
                  value={form.principalName}
                  onChange={(event) => updateField('principalName', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Phone Number</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(event) => updateField('phoneNumber', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Address Line 1</label>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(event) => updateField('addressLine1', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Address Line 2</label>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(event) => updateField('addressLine2', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(event) => updateField('state', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(event) => updateField('country', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(event) => updateField('postalCode', event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
