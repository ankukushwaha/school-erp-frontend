import React, { useEffect, useState } from 'react';
import {
  X,
  GraduationCap,
  Save
} from 'lucide-react';
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox';
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs';
import type { CommonSearchItem } from '@/services/commonSearch';


interface TeacherAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allocationData: any) => void;
  editingAllocation: any | null;
}

export const TeacherAllocationModal: React.FC<TeacherAllocationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAllocation,
}) => {
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('');
  const [academicYearName, setAcademicYearName] = useState('');

  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [teacherName, setTeacherName] = useState('');

  const [selectedClassId, setSelectedClassId] = useState('');
  const [className, setClassName] = useState('');

  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [sectionName, setSectionName] = useState('');

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (editingAllocation) {
      setSelectedAcademicYearId(editingAllocation.academicYearId?.toString() || '');
      setAcademicYearName(editingAllocation.academicYearName || '');

      setSelectedTeacherId(editingAllocation.teacherId.toString());
      setTeacherName(editingAllocation.teacherName || '');

      setSelectedClassId(editingAllocation.classId.toString());
      setClassName(editingAllocation.className || '');

      setSelectedSectionId(editingAllocation.sectionId.toString());
      setSectionName(editingAllocation.sectionName || '');

      setSelectedSubjects(editingAllocation.subjects || []);
    } else {
      setSelectedAcademicYearId('');
      setAcademicYearName('');
      setSelectedTeacherId('');
      setTeacherName('');
      setSelectedClassId('');
      setClassName('');
      setSelectedSectionId('');
      setSectionName('');
      setSelectedSubjects([]);
    }
  }, [editingAllocation, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      academicYearId: parseInt(selectedAcademicYearId),
      teacherId: parseInt(selectedTeacherId),
      classId: parseInt(selectedClassId),
      sectionId: parseInt(selectedSectionId),
      subjects: selectedSubjects
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full lg:w-[480px] bg-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{editingAllocation ? 'Edit Allocation' : 'New Allocation'}</h2>
                <p className="text-xs text-gray-100 opacity-80">Set responsibilities for the academic term</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <CommonSearchTextbox
                searchConfig={COMMON_SEARCH_CONFIGS.academicYear}
                value={academicYearName}
                onChange={(val) => {
                  setAcademicYearName(val);
                  if (!val) setSelectedAcademicYearId('');
                }}
                onSelect={(item: CommonSearchItem) => {
                  setSelectedAcademicYearId(item.id.toString());
                  setAcademicYearName(item.label);
                }}
                placeholder="Search year..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Select Teacher <span className="text-red-500">*</span>
              </label>
              <CommonSearchTextbox
                searchConfig={COMMON_SEARCH_CONFIGS.teacherName}
                value={teacherName}
                onChange={(val) => {
                  setTeacherName(val);
                  if (!val) setSelectedTeacherId('');
                }}
                onSelect={(item: CommonSearchItem) => {
                  setSelectedTeacherId(item.id.toString());
                  setTeacherName(item.label);
                }}
                placeholder="Search teacher..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Select Class <span className="text-red-500">*</span>
              </label>
              <CommonSearchTextbox
                searchConfig={COMMON_SEARCH_CONFIGS.className}
                value={className}
                onChange={(val) => {
                  setClassName(val);
                  if (!val) {
                    setSelectedClassId('');
                    setSelectedSectionId('');
                    setSectionName('');
                  }
                }}
                onSelect={(item: CommonSearchItem) => {
                  setSelectedClassId(item.id.toString());
                  setClassName(item.label);
                  // Reset section when class changes
                  setSelectedSectionId('');
                  setSectionName('');
                }}
                placeholder="Search class..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Select Section <span className="text-red-500">*</span>
              </label>
              <CommonSearchTextbox
                searchConfig={COMMON_SEARCH_CONFIGS.sectionName}
                value={sectionName}
                onChange={(val) => {
                  setSectionName(val);
                  if (!val) setSelectedSectionId('');
                }}
                onSelect={(item: CommonSearchItem) => {
                  setSelectedSectionId(item.id.toString());
                  setSectionName(item.label);
                }}
                placeholder="Search section..."
                required
              />
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
