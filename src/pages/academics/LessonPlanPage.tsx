import { useState } from 'react';
import { 
  ArrowLeft, 
  Clipboard,
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen,
  Calendar,
  Search,
  ChevronDown,
  CheckCircle2,
  Clock,
  Target,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LessonPlanModal } from '@/components/modal/academics/LessonPlanModal';

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

const mockLessons: LessonPlan[] = [
  { 
    id: 1, 
    date: '2024-02-06', 
    subjectId: 1, 
    subjectName: 'Mathematics', 
    classId: 10, 
    className: 'Class 10', 
    sectionName: 'A',
    topic: 'Quadratic Equations - Completing the Square', 
    learningObjectives: ['Understand the method of completing the square', 'Solve quadratic equations using this method'],
    activities: 'Lecture followed by practice problems',
    resources: 'Textbook, Whiteboard, Practice worksheets',
    duration: 45,
    status: 'Completed',
    notes: 'Students grasped the concept well'
  },
  { 
    id: 2, 
    date: '2024-02-07', 
    subjectId: 2, 
    subjectName: 'Science', 
    classId: 10, 
    className: 'Class 10', 
    sectionName: 'A',
    topic: 'Chemical Reactions and Equations', 
    learningObjectives: ['Identify types of chemical reactions', 'Balance chemical equations'],
    activities: 'Lab demonstration and group work',
    resources: 'Lab equipment, Chemicals, Safety gear',
    duration: 60,
    status: 'In Progress',
    notes: 'Plan to do practical demonstration'
  },
  { 
    id: 3, 
    date: '2024-02-08', 
    subjectId: 3, 
    subjectName: 'English', 
    classId: 10, 
    className: 'Class 10', 
    sectionName: 'A',
    topic: 'Poetry Analysis - The Road Not Taken', 
    learningObjectives: ['Analyze literary devices', 'Interpret themes and meaning'],
    activities: 'Group discussion and written analysis',
    resources: 'Poetry anthology, Discussion questions',
    duration: 45,
    status: 'Planned',
    notes: ''
  },
];

const mockClasses = [
  { id: 1, name: 'Class 1', sections: ['A', 'B'] },
  { id: 2, name: 'Class 2', sections: ['A', 'B'] },
  { id: 10, name: 'Class 10', sections: ['A', 'B', 'C'] },
];

const mockSubjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'English' },
];

export const LessonPlanPage = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState(mockLessons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const handleOpenModal = (lesson: LessonPlan | null = null) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingLesson(null);
    setIsModalOpen(false);
  };

  const handleSave = (data: any) => {
    const classInfo = mockClasses.find(c => c.id === data.classId);
    const subjectInfo = mockSubjects.find(s => s.id === data.subjectId);
    
    if (editingLesson) {
      setLessons(lessons.map(lesson => 
        lesson.id === editingLesson.id 
          ? { 
              ...lesson,
              ...data,
              className: classInfo?.name || '',
              subjectName: subjectInfo?.name || '',
            }
          : lesson
      ));
    } else {
      const newLesson: LessonPlan = {
        id: Date.now(),
        ...data,
        className: classInfo?.name || '',
        subjectName: subjectInfo?.name || '',
      };
      setLessons([...lessons, newLesson].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
    handleCloseModal();
  };

  const deleteLesson = (id: number) => {
    if (confirm('Are you sure you want to delete this lesson plan?')) {
      setLessons(lessons.filter(lesson => lesson.id !== id));
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lesson.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || lesson.classId === parseInt(filterClass);
    return matchesSearch && matchesClass;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Planned': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={16} />;
      case 'In Progress': return <Clock size={16} />;
      case 'Planned': return <Calendar size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/academics/overview')} 
            className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors text-gray-600 shadow-sm border border-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Lesson Plans</h1>
            <p className="text-sm text-gray-500 mt-1">Plan and track daily lessons with learning objectives</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Create Lesson Plan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Clipboard size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Lessons</p>
              <p className="text-2xl font-bold text-gray-800">{lessons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{lessons.filter(l => l.status === 'Completed').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">{lessons.filter(l => l.status === 'In Progress').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Planned</p>
              <p className="text-2xl font-bold text-gray-800">{lessons.filter(l => l.status === 'Planned').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by topic or subject..." 
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="relative">
          <select 
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[200px]"
          >
            <option value="all">All Classes</option>
            {mockClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => (
          <div 
            key={lesson.id} 
            className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/60 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{new Date(lesson.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-xl font-bold leading-none">{new Date(lesson.date).getDate()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{lesson.topic}</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-indigo-600">
                      <BookOpen size={12} />
                      {lesson.subjectName}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>{lesson.className} - {lesson.sectionName}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(lesson)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => deleteLesson(lesson.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 flex items-center gap-1.5 ${getStatusColor(lesson.status)}`}>
                  {getStatusIcon(lesson.status)}
                  {lesson.status}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <Clock size={14} className="text-indigo-500" />
                  {lesson.duration} mins
                </span>
              </div>

              {lesson.learningObjectives.length > 0 && (
                <div className="space-y-2 bg-white/30 rounded-xl p-3 border border-white/50">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Target size={12} className="text-indigo-500" />
                    Learning Objectives
                  </h4>
                  <ul className="space-y-1">
                    {lesson.learningObjectives.slice(0, 2).map((obj, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span className="line-clamp-1">{obj}</span>
                      </li>
                    ))}
                    {lesson.learningObjectives.length > 2 && (
                      <li className="text-[10px] text-indigo-500 font-bold ml-3">+{lesson.learningObjectives.length - 2} more...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Activities</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{lesson.activities}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Resources</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{lesson.resources}</p>
              </div>
            </div>

            {lesson.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100 group/notes">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <FileText size={12} className="text-indigo-500" />
                  Observation Notes
                </h4>
                <p className="text-xs text-gray-600 italic">"{lesson.notes}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <LessonPlanModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingLesson={editingLesson}
        classes={mockClasses}
        subjects={mockSubjects}
      />
    </div>
  );
};
