import { useState, useEffect } from 'react'
import { useCreateEnquiryMutation, useUpdateEnquiryMutation } from '@/hooks/useEnquiryMutation'
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PhoneCall,
  Send,
  Star,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react'
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs'
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { CommonSearchItem } from '@/services/commonSearch'

export type EnquiryData = {
  enquiryId: number
  id: string
  studentName: string
  parentName: string
  email: string
  phone: string
  classApplying: string
  enquiryDate: string
  followUpDate?: string
  status: string
  priority: string
  source: string
  assignedTo?: string
  notes?: string
  address?: string
  previousSchool?: string
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getStatusColor(status: string) {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-700'
    case 'contacted': return 'bg-purple-100 text-purple-700'
    case 'follow-up': return 'bg-yellow-100 text-yellow-700'
    case 'visit-scheduled': return 'bg-indigo-100 text-indigo-700'
    case 'converted': return 'bg-green-100 text-green-700'
    case 'closed': return 'bg-gray-100 text-gray-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'new': return <Star className="w-4 h-4" />
    case 'contacted': return <PhoneCall className="w-4 h-4" />
    case 'follow-up': return <Clock className="w-4 h-4" />
    case 'visit-scheduled': return <Calendar className="w-4 h-4" />
    case 'converted': return <CheckCircle className="w-4 h-4" />
    case 'closed': return <XCircle className="w-4 h-4" />
    default: return null
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700'
    case 'medium': return 'bg-orange-100 text-orange-700'
    case 'low': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

// ── Add Enquiry Modal ─────────────────────────────────────────────────────────

type StudentEnquiryAddModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editRecord?: EnquiryData | null
}

const defaultForm = {
  studentName: '', studentMobile: '', studentEmail: '',
  parentName: '', parentMobile: '', parentEmail: '',
  previousSchool: '', occupation: '',
  address: '', city: '', pincode: '',
  source: '', priority: 'Medium',
  followupDate: '', notes: '',
}

export function StudentEnquiryAddModal({ open, onOpenChange, editRecord }: StudentEnquiryAddModalProps) {
  const [form, setForm] = useState(defaultForm)
  const [classApplyingName, setClassApplyingName] = useState('')
  const [assignToName, setAssignToName] = useState('')
  const [assignedToId, setAssignedToId] = useState<number>(0)
  const [error, setError] = useState('')
  const createMutation = useCreateEnquiryMutation()
  const updateMutation = useUpdateEnquiryMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!open) return
    if (editRecord) {
      setForm({
        studentName: editRecord.studentName,
        studentMobile: editRecord.phone,
        studentEmail: editRecord.email,
        parentName: editRecord.parentName,
        parentMobile: editRecord.phone,
        parentEmail: editRecord.email,
        previousSchool: editRecord.previousSchool ?? '',
        occupation: '',
        address: editRecord.address ?? '',
        city: '',
        pincode: '',
        source: editRecord.source,
        priority: editRecord.priority,
        followupDate: editRecord.followUpDate ?? '',
        notes: editRecord.notes ?? '',
      })
      setClassApplyingName(editRecord.classApplying)
      setAssignToName(editRecord.assignedTo ?? '')
    } else {
      reset()
    }
  }, [open, editRecord])

  const inputCls = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  function set(field: keyof typeof defaultForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function reset() {
    setForm(defaultForm)
    setClassApplyingName('')
    setAssignToName('')
    setAssignedToId(0)
    setError('')
  }

  async function handleSubmit() {
    setError('')
    const payload = {
      enquiryNo: editRecord?.id ?? '',
      studentName: form.studentName,
      studentMobile: form.studentMobile,
      studentEmail: form.studentEmail,
      parentName: form.parentName,
      parentMobile: form.parentMobile,
      parentEmail: form.parentEmail,
      previousSchool: form.previousSchool,
      occupation: form.occupation,
      address: form.address,
      city: form.city,
      districtId: 0,
      stateId: 0,
      pincode: form.pincode,
      source: form.source,
      priority: form.priority,
      assignedTo: assignedToId,
      followupDate: form.followupDate ? new Date(form.followupDate).toISOString() : new Date().toISOString(),
      notes: form.notes,
      authAdd: 'system',
    }
    try {
      if (editRecord) {
        await updateMutation.mutateAsync({ ...payload, enquiryId: editRecord.enquiryId, authLstEdt: 'system' })
      } else {
        await createMutation.mutateAsync(payload)
      }
      reset()
      onOpenChange(false)
    } catch {
      setError('Failed to save enquiry. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-white/20 bg-white p-0 sm:rounded-2xl">
        <DialogHeader className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <DialogTitle className="text-xl font-bold text-gray-900">{editRecord ? 'Edit Enquiry' : 'New Enquiry'}</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          {/* Student Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Student Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                <input type="text" className={inputCls} placeholder="Enter student name" value={form.studentName} onChange={set('studentName')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Applying For *</label>
                <CommonSearchTextbox
                  searchConfig={COMMON_SEARCH_CONFIGS.className}
                  value={classApplyingName}
                  onChange={(v) => setClassApplyingName(v)}
                  onSelect={(item: CommonSearchItem) => setClassApplyingName(item.label)}
                  placeholder="Search class..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Mobile</label>
                <input type="tel" className={inputCls} placeholder="+91 XXXXX XXXXX" value={form.studentMobile} onChange={set('studentMobile')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Email</label>
                <input type="email" className={inputCls} placeholder="student@email.com" value={form.studentEmail} onChange={set('studentEmail')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous School</label>
                <input type="text" className={inputCls} placeholder="Enter previous school" value={form.previousSchool} onChange={set('previousSchool')} />
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Parent/Guardian Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name *</label>
                <input type="text" className={inputCls} placeholder="Enter parent name" value={form.parentName} onChange={set('parentName')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Mobile *</label>
                <input type="tel" className={inputCls} placeholder="+91 XXXXX XXXXX" value={form.parentMobile} onChange={set('parentMobile')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
                <input type="email" className={inputCls} placeholder="parent@email.com" value={form.parentEmail} onChange={set('parentEmail')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input type="text" className={inputCls} placeholder="Enter occupation" value={form.occupation} onChange={set('occupation')} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea className={inputCls} rows={2} placeholder="Enter address" value={form.address} onChange={set('address')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input type="text" className={inputCls} placeholder="Enter city" value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input type="text" className={inputCls} placeholder="Enter pincode" value={form.pincode} onChange={set('pincode')} />
              </div>
            </div>
          </div>

          {/* Enquiry Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Enquiry Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
                <select className={inputCls} value={form.source} onChange={set('source')}>
                  <option value="">Select source</option>
                  <option>Website</option>
                  <option>Walk-in</option>
                  <option>Phone Call</option>
                  <option>Referral</option>
                  <option>Facebook Ad</option>
                  <option>Google Search</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className={inputCls} value={form.priority} onChange={set('priority')}>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                <CommonSearchTextbox
                  searchConfig={COMMON_SEARCH_CONFIGS.teacherName}
                  value={assignToName}
                  onChange={(v) => { setAssignToName(v); setAssignedToId(0) }}
                  onSelect={(item: CommonSearchItem) => { setAssignToName(item.label); setAssignedToId(Number(item.id)) }}
                  placeholder="Search staff member..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                <input type="date" className={inputCls} value={form.followupDate} onChange={set('followupDate')} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea className={inputCls} rows={4} placeholder="Add any additional notes or requirements..." value={form.notes} onChange={set('notes')} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { reset(); onOpenChange(false) }}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending ? 'Saving...' : editRecord ? 'Update Enquiry' : 'Add Enquiry'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── View Details Modal ────────────────────────────────────────────────────────

type StudentEnquiryDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enquiry: EnquiryData | null
}

export function StudentEnquiryDetailsModal({ open, onOpenChange, enquiry }: StudentEnquiryDetailsModalProps) {
  if (!enquiry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-white/20 bg-white p-0 sm:rounded-2xl">
        <DialogHeader className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl">
          <DialogTitle className="text-xl font-bold text-white">Enquiry Details</DialogTitle>
          <p className="text-indigo-100 text-sm">{enquiry.id}</p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Status & Priority */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(enquiry.status)}`}>
              {getStatusIcon(enquiry.status)}
              {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1).replace('-', ' ')}
            </span>
            <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getPriorityColor(enquiry.priority)}`}>
              {enquiry.priority.toUpperCase()} Priority
            </span>
          </div>

          {/* Student Info */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4">Student Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-semibold text-gray-900">{enquiry.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class Applying</p>
                <p className="font-semibold text-gray-900">{enquiry.classApplying}</p>
              </div>
              {enquiry.previousSchool && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Previous School</p>
                  <p className="font-semibold text-gray-900">{enquiry.previousSchool}</p>
                </div>
              )}
            </div>
          </div>

          {/* Parent Contact */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4">Parent/Guardian Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{enquiry.parentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{enquiry.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{enquiry.email}</p>
                </div>
              </div>
              {enquiry.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{enquiry.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enquiry Timeline */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Enquiry Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Enquiry Date:</span>
                <span className="font-medium text-gray-900">{new Date(enquiry.enquiryDate).toLocaleDateString()}</span>
              </div>
              {enquiry.followUpDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">Follow-up Date:</span>
                  <span className="font-medium text-yellow-700">{new Date(enquiry.followUpDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Source:</span>
                <span className="font-medium text-gray-900">{enquiry.source}</span>
              </div>
              {enquiry.assignedTo && (
                <div className="flex items-center gap-3 text-sm">
                  <UserPlus className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600">Assigned To:</span>
                  <span className="font-medium text-gray-900">{enquiry.assignedTo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {enquiry.notes && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
                Notes
              </h4>
              <p className="text-gray-700">{enquiry.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
            <button className="px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <PhoneCall className="w-4 h-4" /> Make Call
            </button>
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Email
            </button>
            <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" /> Edit Details
            </button>
            <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Convert to Admission
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
