import React, { useEffect, useState } from 'react';
import {
  X,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type AssignmentStatus = 'active' | 'completed' | 'overdue' | 'draft';

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link';
  size: string;
  url: string;
}

export interface GradingRubric {
  criteria: {
    name: string;
    maxPoints: number;
    description: string;
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  section: string;
  description: string;
  dueDate: string;
  dueTime: string;
  assignedDate: string;
  totalMarks: number;
  attachments: Attachment[];
  status: AssignmentStatus;
  submissionCount: number;
  totalStudents: number;
  submissionRate: number;
  avgGrade: number;
  teacher: string;
  priority: 'low' | 'medium' | 'high';
  allowLateSubmission: boolean;
  rubric?: GradingRubric;
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingAssignment: Assignment | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAssignment,
}) => {
  const [formData, setFormData] = useState<Partial<Assignment>>({
    title: '',
    subject: 'Mathematics',
    class: '10',
    section: 'A',
    description: '',
    dueDate: '',
    dueTime: '',
    totalMarks: 100,
    priority: 'medium',
    allowLateSubmission: false,
  });

  useEffect(() => {
    if (editingAssignment) {
      setFormData(editingAssignment);
    } else {
      setFormData({
        title: '',
        subject: 'Mathematics',
        class: '10',
        section: 'A',
        description: '',
        dueDate: '',
        dueTime: '',
        totalMarks: 100,
        priority: 'medium',
        allowLateSubmission: false,
      });
    }
  }, [editingAssignment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  >
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                    <option>Chemistry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class & Section *
                  </label>
                  <select
                    value={`${formData.class}-${formData.section}`}
                    onChange={(e) => {
                      const [cls, sec] = e.target.value.split('-');
                      setFormData({ ...formData, class: cls, section: sec });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  >
                    <option value="10-A">10-A</option>
                    <option value="10-B">10-B</option>
                    <option value="9-A">9-A</option>
                    <option value="9-B">9-B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the assignment requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Time *
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Marks *
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowLateSubmission}
                    onChange={(e) => setFormData({ ...formData, allowLateSubmission: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Allow late submissions</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-violet-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, Images, Videos (Max 10MB)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md"
                >
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-violet-300 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
