import React, { useEffect, useState } from 'react';
import { 
  X, 
  Save, 
  Clock,
  BookOpen,
  Users,
  Home
} from 'lucide-react';

interface Period {
  id: number;
  dayIndex: number;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  roomNumber: string;
  type: 'class' | 'break' | 'lunch';
}

interface TimetablePeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (period: any) => void;
  editingPeriod: Period | null;
  days: string[];
  subjects: any[];
  teachers: any[];
  initialDay?: number;
  initialPeriodNumber?: string;
}

export const TimetablePeriodModal: React.FC<TimetablePeriodModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPeriod,
  days,
  subjects,
  teachers,
  initialDay = 0,
  initialPeriodNumber = ''
}) => {
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [periodNumber, setPeriodNumber] = useState(initialPeriodNumber);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [periodType, setPeriodType] = useState<'class' | 'break' | 'lunch'>('class');

  useEffect(() => {
    if (editingPeriod) {
      setSelectedDay(editingPeriod.dayIndex);
      setPeriodNumber(editingPeriod.periodNumber.toString());
      setStartTime(editingPeriod.startTime);
      setEndTime(editingPeriod.endTime);
      setSelectedSubjectId(editingPeriod.subjectId.toString());
      setSelectedTeacherId(editingPeriod.teacherId.toString());
      setRoomNumber(editingPeriod.roomNumber);
      setPeriodType(editingPeriod.type);
    } else {
      setSelectedDay(initialDay);
      setPeriodNumber(initialPeriodNumber);
      setStartTime('');
      setEndTime('');
      setSelectedSubjectId('');
      setSelectedTeacherId('');
      setRoomNumber('');
      setPeriodType('class');
    }
  }, [editingPeriod, isOpen, initialDay, initialPeriodNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = subjects.find(s => s.id === parseInt(selectedSubjectId));
    const teacher = teachers.find(t => t.id === parseInt(selectedTeacherId));

    onSave({
      id: editingPeriod?.id || Date.now(),
      dayIndex: selectedDay,
      periodNumber: parseInt(periodNumber),
      startTime,
      endTime,
      subjectId: periodType === 'class' ? parseInt(selectedSubjectId) : 0,
      subjectName: periodType === 'class' ? (subject?.name || '') : (periodType === 'break' ? 'Short Break' : 'Lunch Break'),
      teacherId: periodType === 'class' ? parseInt(selectedTeacherId) : 0,
      teacherName: periodType === 'class' ? (teacher?.name || '') : '',
      roomNumber: periodType === 'class' ? roomNumber : '',
      type: periodType
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border border-white/20 shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {editingPeriod ? 'Edit Period' : 'Add New Period'}
            </h3>
            <p className="text-sm text-gray-500">Configure schedule slot details</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Period Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {(['class', 'break', 'lunch'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPeriodType(type)}
                  className={`flex-1 py-3 rounded-2xl border-2 font-bold transition-all ${
                    periodType === type 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                      : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Day <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                className="appearance-none w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                required
              >
                {days.map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Period Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={periodNumber}
                onChange={(e) => setPeriodNumber(e.target.value)}
                placeholder="1" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                  required 
                />
              </div>
            </div>
          </div>

          {periodType === 'class' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="appearance-none w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                      required={periodType === 'class'}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Teacher <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                      className="appearance-none w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                      required={periodType === 'class'}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="201" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                    required={periodType === 'class'}
                  />
                </div>
              </div>
            </>
          )}

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
              <Save size={18} />
              {editingPeriod ? 'Update Period' : 'Add Period'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
