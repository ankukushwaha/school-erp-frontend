import { useEffect, useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TeacherAllocationModal } from '@/components/modal/academics/TeacherAllocationModal';
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal';
import {
  getClassTeacherAllocations,
  createClassTeacherAllocation,
  updateClassTeacherAllocation,
  deleteClassTeacherAllocation,
  type ClassTeacherAllocation
} from '@/services/classTeacherAllocation';
import { toast } from 'sonner';

export const ClassTeacherAllocationPage = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState<ClassTeacherAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<ClassTeacherAllocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const allocData = await getClassTeacherAllocations();
      setAllocations(allocData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load allocation data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (alloc: ClassTeacherAllocation | null = null) => {
    setEditingAllocation(alloc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAllocation(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data: any) => {
    try {
      const payload = {
        academicYearId: data.academicYearId,
        schoolId: 1, // Defaulting to 1 for now
        classId: data.classId,
        sectionId: data.sectionId,
        teacherId: data.teacherId,
        isActive: true,
      };

      if (editingAllocation) {
        await updateClassTeacherAllocation(editingAllocation.id, {
          ...payload,
          classTeacherId: editingAllocation.id
        });
        toast.success('Allocation updated successfully');
      } else {
        await createClassTeacherAllocation(payload);
        toast.success('Teacher allocated successfully');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving allocation:', error);
      toast.error('Failed to save allocation');
    }
  };

  const confirmDelete = (id: number) => {
    setAllocationToDelete(id);
    setDeleteModalOpen(true);
  };

  const deleteAllocation = async () => {
    if (!allocationToDelete) return;
    try {
      await deleteClassTeacherAllocation(allocationToDelete, 'ADMIN');
      toast.success('Allocation removed successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting allocation:', error);
      toast.error('Failed to remove allocation');
    } finally {
      setDeleteModalOpen(false);
      setAllocationToDelete(null);
    }
  };

  const filteredAllocations = allocations.filter(alloc =>
    alloc.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alloc.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alloc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading allocations...</p>
      </div>
    );
  }

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
                  onClick={() => confirmDelete(alloc.id)}
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

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">Academic Year</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                  {alloc.academicYearName}
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
      />

      <ConfirmActionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Remove Allocation"
        description="Are you sure you want to remove this class teacher allocation?"
        confirmLabel="Remove"
        onConfirm={deleteAllocation}
      />
    </div>
  );
};
