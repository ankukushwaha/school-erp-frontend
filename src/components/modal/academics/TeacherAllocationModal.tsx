import React, { useEffect, useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  Save, 
  ChevronDown 
} from 'lucide-react';

interface TeacherAllocation {
  id: number;
  teacherId: number;
  teacherName: string;
  email: string;
  phone: string;
  classId: number;
  className: string;
  sectionId: number;
  sectionName: string;
  subjects: string[];
  studentCount: number;
}

interface TeacherAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allocationData: any) => void;
  editingAllocation: TeacherAllocation | null;
  teachers: any[];
  classes: any[];
}

export const TeacherAllocationModal: React.FC<TeacherAllocationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAllocation,
  teachers,
  classes
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (editingAllocation) {
      setSelectedTeacherId(editingAllocation.teacherId.toString());
      setSelectedClassId(editingAllocation.classId.toString());
      setSelectedSection(editingAllocation.sectionName);
      setSelectedSubjects(editingAllocation.subjects);
    } else {
      setSelectedTeacherId('');
      setSelectedClassId('');
      setSelectedSection('');
      setSelectedSubjects([]);
    }
  }, [editingAllocation, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      teacherId: parseInt(selectedTeacherId),
      classId: parseInt(selectedClassId),
      sectionName: selectedSection,
      subjects: selectedSubjects
    });
  };

  const availableSections = selectedClassId 
    ? classes.find(c => c.id === parseInt(selectedClassId))?.sections || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full lg:w-[480px] bg-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {editingAllocation ? 'Edit Allocation' : 'Allocate Class Teacher'}
              </h3>
              <p className="text-xs text-gray-500">Set responsibilities for the academic term</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Select Teacher <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="appearance-none w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all cursor-pointer"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Select Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedSection('');
                  }}
                  className="appearance-none w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all cursor-pointer"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Select Section <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="appearance-none w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all cursor-pointer disabled:opacity-50"
                  required
                  disabled={!selectedClassId}
                >
                  <option value="">Select Section</option>
                  {availableSections.map((section: string) => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Teaching Subjects (Optional)
            </label>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 max-h-40 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer', 'Art'].map(subject => (
                  <label key={subject} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedSubjects.includes(subject)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubjects([...selectedSubjects, subject]);
                        } else {
                          setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
                        }
                      }}
                      className="rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5 transition-colors"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Save size={18} />
              {editingAllocation ? 'Update Changes' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
