import { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  Search,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TeacherAllocationModal } from '@/components/modal/academics/TeacherAllocationModal';

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

const mockAllocations: TeacherAllocation[] = [
  { id: 1, teacherId: 101, teacherName: 'Mrs. Sarah Johnson', email: 'sarah.j@school.com', phone: '+1 234-567-8901', classId: 1, className: 'Class 1', sectionId: 1, sectionName: 'A', subjects: ['Mathematics', 'English'], studentCount: 28 },
  { id: 2, teacherId: 102, teacherName: 'Mr. Robert Williams', email: 'robert.w@school.com', phone: '+1 234-567-8902', classId: 1, className: 'Class 1', sectionId: 2, sectionName: 'B', subjects: ['Science', 'Social Studies'], studentCount: 29 },
  { id: 3, teacherId: 103, teacherName: 'Ms. Emily Brown', email: 'emily.b@school.com', phone: '+1 234-567-8903', classId: 2, className: 'Class 2', sectionId: 3, sectionName: 'A', subjects: ['Mathematics', 'Science'], studentCount: 27 },
  { id: 4, teacherId: 104, teacherName: 'Dr. Michael Davis', email: 'michael.d@school.com', phone: '+1 234-567-8904', classId: 10, className: 'Class 10', sectionId: 7, sectionName: 'A', subjects: ['Mathematics', 'Physics'], studentCount: 32 },
  { id: 5, teacherId: 105, teacherName: 'Mrs. Jennifer Wilson', email: 'jennifer.w@school.com', phone: '+1 234-567-8905', classId: 10, className: 'Class 10', sectionId: 8, sectionName: 'B', subjects: ['Chemistry', 'Biology'], studentCount: 35 },
];

const mockTeachers = [
  { id: 101, name: 'Mrs. Sarah Johnson', email: 'sarah.j@school.com', phone: '+1 234-567-8901' },
  { id: 102, name: 'Mr. Robert Williams', email: 'robert.w@school.com', phone: '+1 234-567-8902' },
  { id: 103, name: 'Ms. Emily Brown', email: 'emily.b@school.com', phone: '+1 234-567-8903' },
  { id: 104, name: 'Dr. Michael Davis', email: 'michael.d@school.com', phone: '+1 234-567-8904' },
  { id: 105, name: 'Mrs. Jennifer Wilson', email: 'jennifer.w@school.com', phone: '+1 234-567-8905' },
  { id: 106, name: 'Mr. James Taylor', email: 'james.t@school.com', phone: '+1 234-567-8906' },
];

const mockClasses = [
  { id: 1, name: 'Class 1', sections: ['A', 'B', 'C'] },
  { id: 2, name: 'Class 2', sections: ['A', 'B', 'C'] },
  { id: 10, name: 'Class 10', sections: ['A', 'B', 'C'] },
];

export const ClassTeacherAllocationPage = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState(mockAllocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<TeacherAllocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (alloc: TeacherAllocation | null = null) => {
    setEditingAllocation(alloc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAllocation(null);
    setIsModalOpen(false);
  };

  const handleSave = (data: any) => {
    const teacher = mockTeachers.find(t => t.id === data.teacherId);
    const classInfo = mockClasses.find(c => c.id === data.classId);

    if (editingAllocation) {
      setAllocations(allocations.map(alloc =>
        alloc.id === editingAllocation.id
          ? {
            ...alloc,
            teacherId: data.teacherId,
            teacherName: teacher?.name || '',
            email: teacher?.email || '',
            phone: teacher?.phone || '',
            classId: data.classId,
            className: classInfo?.name || '',
            sectionName: data.sectionName,
            subjects: data.subjects
          }
          : alloc
      ));
    } else {
      const newAllocation: TeacherAllocation = {
        id: Date.now(),
        teacherId: data.teacherId,
        teacherName: teacher?.name || '',
        email: teacher?.email || '',
        phone: teacher?.phone || '',
        classId: data.classId,
        className: classInfo?.name || '',
        sectionId: Date.now(),
        sectionName: data.sectionName,
        subjects: data.subjects,
        studentCount: 0
      };
      setAllocations([...allocations, newAllocation]);
    }
    handleCloseModal();
  };

  const deleteAllocation = (id: number) => {
    if (confirm('Are you sure you want to remove this class teacher allocation?')) {
      setAllocations(allocations.filter(alloc => alloc.id !== id));
    }
  };

  const filteredAllocations = allocations.filter(alloc =>
    alloc.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alloc.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alloc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/academics/overview')}
            className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Class Teacher Allocation</h1>
            <p className="text-sm text-gray-500 mt-1">Assign class teachers to sections and manage responsibilities</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Allocate Teacher
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Class Teachers</p>
              <p className="text-2xl font-bold text-gray-800">{allocations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Classes Covered</p>
              <p className="text-2xl font-bold text-gray-800">{new Set(allocations.map(a => a.classId)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{allocations.reduce((acc, a) => acc + a.studentCount, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Allocation Rate</p>
              <p className="text-2xl font-bold text-gray-800">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by teacher name, class, or email..."
          className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Allocations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAllocations.map((alloc) => (
          <div
            key={alloc.id}
            className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/60 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl">
                  {alloc.teacherName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{alloc.teacherName}</h3>
                  <p className="text-xs text-gray-500">ID: {alloc.teacherId}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(alloc)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteAllocation(alloc.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                <span>{alloc.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{alloc.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">Assigned Class</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                  {alloc.className} - {alloc.sectionName}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Users size={14} /> Students
                </span>
                <span className="font-bold text-gray-800">{alloc.studentCount}</span>
              </div>

              {alloc.subjects.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">Teaching Subjects</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {alloc.subjects.map((subject, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TeacherAllocationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingAllocation={editingAllocation}
        teachers={mockTeachers}
        classes={mockClasses}
      />
    </div>
  );
};
