import { SettingsUpdateModal } from '@/components/modal/SettingsUpdateModal'
import { useSchoolQuery, useUpdateSchoolMutation } from '@/hooks/useSchoolQuery'
import type { SchoolRecord, UpdateSchoolPayload } from '@/services/school'
import { Bell, Camera, Lock, Palette, Save, Shield, User } from 'lucide-react'
import { useMemo, useState } from 'react'

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance'

type TabItem = {
  id: SettingsTab
  label: string
  icon: typeof User
}

const tabs: TabItem[] = [
  { id: 'profile', label: 'School Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

function getLogoSrc(school: SchoolRecord | null): string | null {
  if (!school?.logo) return null
  if (school.logo.startsWith('http://') || school.logo.startsWith('https://') || school.logo.startsWith('data:')) {
    return school.logo
  }
  const logoType = school.logoType || 'image/jpeg'
  return `data:${logoType};base64,${school.logo}`
}

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const { data = [], isLoading, isError } = useSchoolQuery()
  const updateMutation = useUpdateSchoolMutation()
  const school = data.length > 0 ? data[0] : null

  const addressText = useMemo(() => {
    if (!school) return ''
    return [school.addressLine1, school.addressLine2, school.city, school.state, school.country, school.postalCode]
      .filter(Boolean)
      .join(', ')
  }, [school])

  const logoSrc = getLogoSrc(school)
  const initial = (school?.schoolName?.trim()?.charAt(0) || 'S').toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage system configuration and preferences</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {isError ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">Unable to load school profile data.</p> : null}
      {updateError ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{updateError}</p> : null}

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full flex-shrink-0 space-y-2 lg:w-64">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'flex items-center gap-3 text-gray-600 hover:bg-white/50 hover:text-indigo-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={18} />
                {tab.label}
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-2xl border border-white/20 bg-white/40 p-8 shadow-lg backdrop-blur-xl">
          {isLoading ? <p className="text-sm text-gray-500">Loading school profile...</p> : null}

          {!isLoading && activeTab === 'profile' ? (
            <div className="space-y-8">
              <div className="flex items-center gap-6 border-b border-gray-100/50 pb-8">
                <div className="group relative cursor-pointer">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-600 shadow-md">
                    {logoSrc ? <img src={logoSrc} alt={school?.logoName || 'School logo'} className="h-full w-full object-cover" /> : initial}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">School Logo</h3>
                  <p className="mt-1 text-sm text-gray-500">Recommended size: 512x512px (PNG, JPG)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">School Name</label>
                  <input
                    type="text"
                    value={school?.schoolName ?? ''}
                    readOnly
                    className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Principal Name</label>
                  <input
                    type="text"
                    value={school?.principalName ?? ''}
                    readOnly
                    className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Email Address</label>
                  <input
                    type="email"
                    value={school?.email ?? ''}
                    readOnly
                    className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Phone Number</label>
                  <input
                    type="tel"
                    value={school?.phoneNumber ?? ''}
                    readOnly
                    className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Address</label>
                  <textarea
                    rows={3}
                    value={addressText}
                    readOnly
                    className="w-full resize-none rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {!isLoading && activeTab === 'notifications' ? (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Email Notifications</h3>
              <div className="space-y-4">
                {['New Student Admission', 'Fee Payment Received', 'Daily Attendance Report', 'System Updates'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-white/20 bg-white/30 p-4">
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!isLoading && activeTab === 'security' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
                <Shield size={24} />
                <div>
                  <h4 className="text-sm font-bold">Two-Factor Authentication</h4>
                  <p className="mt-1 text-xs opacity-80">Add an extra layer of security to your account.</p>
                </div>
                <button className="ml-auto rounded-lg bg-white px-4 py-2 text-xs font-bold text-amber-600 shadow-sm">Enable</button>
              </div>

              <div className="space-y-4">
                <h3 className="mt-6 text-lg font-bold text-gray-800">Change Password</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Current Password</label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">New Password</label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {!isLoading && activeTab === 'appearance' ? (
            <div className="py-12 text-center text-gray-500">
              <Palette size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium">Theme Settings</h3>
              <p className="mt-2 text-sm">Dark mode and custom accent colors coming soon!</p>
            </div>
          ) : null}
        </div>
      </div>

      <SettingsUpdateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialSchool={school}
        isUpdating={updateMutation.isPending}
        onUpdate={async (payload: UpdateSchoolPayload) => {
          try {
            await updateMutation.mutateAsync(payload)
            setUpdateError('')
          } catch (error) {
            setUpdateError(error instanceof Error ? error.message : 'Failed to update school details.')
            throw error
          }
        }}
      />
    </div>
  )
}
