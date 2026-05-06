import React, { useState } from 'react';
import { 
  X, 
  Plus,
  BookOpen,
  Layers,
  Calendar
} from 'lucide-react';

interface TimetableCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  classes: any[];
}

export const TimetableCreateModal: React.FC<TimetableCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  classes
}) => {
  const [newClassId, setNewClassId] = useState('');
  const [newSection, setNewSection] = useState('');
  const [newAcademicYear, setNewAcademicYear] = useState('2023-24');

  if (!isOpen) return null;

  const availableSections = newClassId 
    ? classes.find(c => c.id === parseInt(newClassId))?.sections || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classInfo = classes.find(c => c.id === parseInt(newClassId));
    
    onCreate({
      classId: parseInt(newClassId),
      className: classInfo?.name || '',
      sectionName: newSection,
      academicYear: newAcademicYear
    });
    
    setNewClassId('');
    setNewSection('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border border-white/20 shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Create New Timetable</h3>
            <p className="text-sm text-gray-500">Initialize a schedule for a class section</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Select Class <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={newClassId}
                onChange={(e) => {
                  setNewClassId(e.target.value);
                  setNewSection('');
                }}
                className="appearance-none w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Select Section <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Layers size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="appearance-none w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 disabled:opacity-50"
                required
                disabled={!newClassId}
              >
                <option value="">Select Section</option>
                {availableSections.map((section: string) => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={newAcademicYear}
                onChange={(e) => setNewAcademicYear(e.target.value)}
                placeholder="2023-24" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                required 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus size={18} />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
