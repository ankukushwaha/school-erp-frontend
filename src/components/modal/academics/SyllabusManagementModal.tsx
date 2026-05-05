import React, { useEffect, useState } from 'react';
import { 
  X, 
  BookMarked, 
  BookOpen, 
  Save, 
  ChevronDown,
  Upload,
  FileText,
  Clock
} from 'lucide-react';

interface SyllabusItem {
  id: number;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  term: string;
  totalTopics: number;
  completedTopics: number;
  status: 'On Track' | 'Behind' | 'Completed';
  lastUpdated: string;
  document?: string;
}

interface SyllabusManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (syllabusData: any) => void;
  editingItem: SyllabusItem | null;
  classes: any[];
  subjects: any[];
  terms: string[];
}

export const SyllabusManagementModal: React.FC<SyllabusManagementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  classes,
  subjects,
  terms
}) => {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [totalTopics, setTotalTopics] = useState('');
  const [completedTopics, setCompletedTopics] = useState('');
  const [document, setDocument] = useState('');

  useEffect(() => {
    if (editingItem) {
      setSelectedClassId(editingItem.classId.toString());
      setSelectedSubjectId(editingItem.subjectId.toString());
      setSelectedTerm(editingItem.term);
      setTotalTopics(editingItem.totalTopics.toString());
      setCompletedTopics(editingItem.completedTopics.toString());
      setDocument(editingItem.document || '');
    } else {
      setSelectedClassId('');
      setSelectedSubjectId('');
      setSelectedTerm('');
      setTotalTopics('');
      setCompletedTopics('');
      setDocument('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      classId: parseInt(selectedClassId),
      subjectId: parseInt(selectedSubjectId),
      term: selectedTerm,
      totalTopics: parseInt(totalTopics),
      completedTopics: parseInt(completedTopics),
      document
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full lg:w-[480px] bg-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <BookMarked size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {editingItem ? 'Edit Syllabus' : 'Add New Syllabus'}
              </h3>
              <p className="text-xs text-gray-500">Define curriculum progress and topics</p>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Select Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
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
                Term <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="appearance-none w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all cursor-pointer"
                  required
                >
                  <option value="">Select Term</option>
                  {terms.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Select Subject <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="appearance-none w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all cursor-pointer"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Topics <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={totalTopics}
                onChange={(e) => setTotalTopics(e.target.value)}
                placeholder="15" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Completed Topics <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={completedTopics}
                onChange={(e) => setCompletedTopics(e.target.value)}
                placeholder="10" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Syllabus Document (Optional)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  placeholder="curriculum_v1.pdf" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                />
              </div>
              <button 
                type="button"
                className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
              >
                <Upload size={18} />
              </button>
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
              {editingItem ? 'Update Changes' : 'Create Syllabus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
