import React, { useEffect, useState } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Save,
  ChevronDown,
  Calendar,
  Clock,
  Target,
  FileText,
  Clipboard
} from 'lucide-react';

interface LessonPlan {
  id: number;
  date: string;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  sectionName: string;
  topic: string;
  learningObjectives: string[];
  activities: string;
  resources: string;
  duration: number;
  status: 'Planned' | 'In Progress' | 'Completed';
  notes: string;
}

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: any) => void;
  editingLesson: LessonPlan | null;
  classes: any[];
  subjects: any[];
}

export const LessonPlanModal: React.FC<LessonPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLesson,
  classes,
  subjects
}) => {
  const [date, setDate] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [topic, setTopic] = useState('');
  const [objectives, setObjectives] = useState(['']);
  const [activities, setActivities] = useState('');
  const [resources, setResources] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<'Planned' | 'In Progress' | 'Completed'>('Planned');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingLesson) {
      setDate(editingLesson.date);
      setSelectedClassId(editingLesson.classId.toString());
      setSelectedSection(editingLesson.sectionName);
      setSelectedSubjectId(editingLesson.subjectId.toString());
      setTopic(editingLesson.topic);
      setObjectives(editingLesson.learningObjectives.length > 0 ? editingLesson.learningObjectives : ['']);
      setActivities(editingLesson.activities);
      setResources(editingLesson.resources);
      setDuration(editingLesson.duration.toString());
      setStatus(editingLesson.status);
      setNotes(editingLesson.notes);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setSelectedClassId('');
      setSelectedSection('');
      setSelectedSubjectId('');
      setTopic('');
      setObjectives(['']);
      setActivities('');
      setResources('');
      setDuration('45');
      setStatus('Planned');
      setNotes('');
    }
  }, [editingLesson, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      classId: parseInt(selectedClassId),
      sectionName: selectedSection,
      subjectId: parseInt(selectedSubjectId),
      topic,
      learningObjectives: objectives.filter(o => o.trim()),
      activities,
      resources,
      duration: parseInt(duration),
      status,
      notes
    });
  };

  const addObjective = () => setObjectives([...objectives, '']);
  const removeObjective = (index: number) => {
    if (objectives.length > 1) setObjectives(objectives.filter((_, i) => i !== index));
  };
  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const availableSections = selectedClassId
    ? classes.find(c => c.id === parseInt(selectedClassId))?.sections || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full lg:w-[540px] bg-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Clipboard size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {editingLesson ? 'Edit Lesson Plan' : 'Create Lesson Plan'}
              </h3>
              <p className="text-xs text-gray-500">Define teaching strategies and objectives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="appearance-none w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all cursor-pointer"
                  required
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Class <span className="text-red-500">*</span>
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
                Section <span className="text-red-500">*</span>
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
              Subject <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Topic Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quadratic Equations - Introduction"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Learning Objectives <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addObjective}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add Objective
              </button>
            </div>
            <div className="space-y-2">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex gap-2 group">
                  <div className="relative flex-1">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(idx, e.target.value)}
                      placeholder={`Objective ${idx + 1}`}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                      required
                    />
                  </div>
                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(idx)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Activities <span className="text-red-500">*</span>
            </label>
            <textarea
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Describe lesson activities, methodology, etc."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Resources <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="Textbook, Lab kit, etc."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Duration (mins) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="45"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observation or reflections..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 min-h-[80px] resize-none"
            />
          </div>

          <div className="pt-4 flex gap-4 pb-2">
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
              {editingLesson ? 'Update Plan' : 'Save Lesson Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
