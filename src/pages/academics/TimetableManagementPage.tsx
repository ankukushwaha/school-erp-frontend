import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Clock,
  BookOpen,
  ChevronDown,
  Copy,
  Download,
  Printer,
  AlertCircle,
  CheckCircle2,
  Coffee,
  Wand2,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TimetablePeriodModal } from '@/components/modal/academics/TimetablePeriodModal';
import { TimetableCreateModal } from '@/components/modal/academics/TimetableCreateModal';
import { TimetableAutoGenModal } from '@/components/modal/academics/TimetableAutoGenModal';

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

interface Timetable {
  id: number;
  classId: number;
  className: string;
  sectionName: string;
  academicYear: string;
  periods: Period[];
  isActive: boolean;
}

const mockTimetables: Timetable[] = [
  {
    id: 1,
    classId: 10,
    className: 'Class 10',
    sectionName: 'A',
    academicYear: '2023-24',
    isActive: true,
    periods: [
      { id: 1, dayIndex: 0, periodNumber: 1, startTime: '08:00', endTime: '08:45', subjectId: 1, subjectName: 'Mathematics', teacherId: 101, teacherName: 'Mr. Anderson', roomNumber: '201', type: 'class' },
      { id: 2, dayIndex: 0, periodNumber: 2, startTime: '08:45', endTime: '09:30', subjectId: 2, subjectName: 'Physics', teacherId: 102, teacherName: 'Mrs. Davis', roomNumber: '202', type: 'class' },
      { id: 3, dayIndex: 0, periodNumber: 3, startTime: '09:30', endTime: '09:45', subjectId: 0, subjectName: 'Short Break', teacherId: 0, teacherName: '', roomNumber: '', type: 'break' },
      { id: 4, dayIndex: 0, periodNumber: 4, startTime: '09:45', endTime: '10:30', subjectId: 3, subjectName: 'Chemistry', teacherId: 103, teacherName: 'Mr. Brown', roomNumber: '203', type: 'class' },
      { id: 5, dayIndex: 0, periodNumber: 5, startTime: '10:30', endTime: '11:15', subjectId: 4, subjectName: 'English', teacherId: 104, teacherName: 'Ms. Wilson', roomNumber: '204', type: 'class' },
      { id: 6, dayIndex: 0, periodNumber: 6, startTime: '11:15', endTime: '12:00', subjectId: 0, subjectName: 'Lunch Break', teacherId: 0, teacherName: '', roomNumber: '', type: 'lunch' },

      { id: 7, dayIndex: 1, periodNumber: 1, startTime: '08:00', endTime: '08:45', subjectId: 4, subjectName: 'English', teacherId: 104, teacherName: 'Ms. Wilson', roomNumber: '204', type: 'class' },
      { id: 8, dayIndex: 1, periodNumber: 2, startTime: '08:45', endTime: '09:30', subjectId: 1, subjectName: 'Mathematics', teacherId: 101, teacherName: 'Mr. Anderson', roomNumber: '201', type: 'class' },
      { id: 9, dayIndex: 1, periodNumber: 4, startTime: '09:45', endTime: '10:30', subjectId: 5, subjectName: 'History', teacherId: 105, teacherName: 'Mr. Taylor', roomNumber: '205', type: 'class' },
    ]
  }
];

const mockClasses = [
  { id: 1, name: 'Class 1', sections: ['A', 'B', 'C'] },
  { id: 10, name: 'Class 10', sections: ['A', 'B', 'C'] },
  { id: 12, name: 'Class 12', sections: ['A', 'B'] },
];

const mockSubjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Physics' },
  { id: 3, name: 'Chemistry' },
  { id: 4, name: 'English' },
  { id: 5, name: 'History' },
  { id: 6, name: 'Geography' },
  { id: 7, name: 'Computer Science' },
  { id: 8, name: 'Physical Education' },
];

const mockTeachers = [
  { id: 101, name: 'Mr. Anderson' },
  { id: 102, name: 'Mrs. Davis' },
  { id: 103, name: 'Mr. Brown' },
  { id: 104, name: 'Ms. Wilson' },
  { id: 105, name: 'Mr. Taylor' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const periodColors = [
  'bg-blue-100 border-blue-200 text-blue-700',
  'bg-purple-100 border-purple-200 text-purple-700',
  'bg-emerald-100 border-emerald-200 text-emerald-700',
  'bg-amber-100 border-amber-200 text-amber-700',
  'bg-rose-100 border-rose-200 text-rose-700',
  'bg-indigo-100 border-indigo-200 text-indigo-700',
  'bg-cyan-100 border-cyan-200 text-cyan-700',
  'bg-pink-100 border-pink-200 text-pink-700',
];

export const TimetableManagementPage = () => {
  const navigate = useNavigate();
  const [timetables, setTimetables] = useState(mockTimetables);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(mockTimetables[0]);

  // Modal states
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoGenModal, setShowAutoGenModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  // Quick Slot Add helper
  const [quickAddSlot, setQuickAddSlot] = useState<{ day: number, period: string } | null>(null);

  // Auto-generation configuration states
  const [autoGenConfig] = useState({
    periodsPerDay: 7,
    startTime: '08:00',
    periodDuration: 45,
    shortBreakAfter: 2,
    shortBreakDuration: 15,
    lunchBreakAfter: 4,
    lunchBreakDuration: 45,
    workingDays: 6,
    subjectDistribution: 'balanced' as 'balanced' | 'priority',
    avoidConsecutiveSame: true
  });

  const handleSavePeriod = (periodData: Period) => {
    if (!selectedTimetable) return;

    if (editingPeriod) {
      const updatedPeriods = selectedTimetable.periods.map(p =>
        p.id === editingPeriod.id ? { ...periodData, id: p.id } : p
      );
      setSelectedTimetable({ ...selectedTimetable, periods: updatedPeriods });
    } else {
      setSelectedTimetable({
        ...selectedTimetable,
        periods: [...selectedTimetable.periods, periodData]
      });
    }

    setShowPeriodModal(false);
    setEditingPeriod(null);
    setQuickAddSlot(null);
  };

  const handleCreateTimetable = (data: any) => {
    const newTimetable: Timetable = {
      id: Date.now(),
      ...data,
      periods: [],
      isActive: true
    };

    setTimetables([...timetables, newTimetable]);
    setSelectedTimetable(newTimetable);
    setShowCreateModal(false);
  };

  const editPeriod = (period: Period) => {
    setEditingPeriod(period);
    setShowPeriodModal(true);
  };

  const deletePeriod = (periodId: number) => {
    if (!selectedTimetable) return;
    if (confirm('Are you sure you want to delete this period?')) {
      const updatedPeriods = selectedTimetable.periods.filter(p => p.id !== periodId);
      setSelectedTimetable({ ...selectedTimetable, periods: updatedPeriods });
    }
  };

  const getPeriodForSlot = (dayIndex: number, periodNum: number) => {
    return selectedTimetable?.periods.find(p => p.dayIndex === dayIndex && p.periodNumber === periodNum);
  };

  const getSubjectColor = (subjectId: number) => {
    return periodColors[subjectId % periodColors.length];
  };

  const checkTeacherConflict = () => {
    if (!selectedTimetable) return [];
    const conflicts: string[] = [];
    const teacherSchedule = new Map<string, Period[]>();

    selectedTimetable.periods.forEach(period => {
      if (period.type !== 'class') return;
      const key = `${period.dayIndex}-${period.startTime}`;
      if (!teacherSchedule.has(key)) {
        teacherSchedule.set(key, []);
      }
      teacherSchedule.get(key)?.push(period);
    });

    teacherSchedule.forEach((periods) => {
      const teacherMap = new Map<number, Period[]>();
      periods.forEach(period => {
        if (!teacherMap.has(period.teacherId)) {
          teacherMap.set(period.teacherId, []);
        }
        teacherMap.get(period.teacherId)?.push(period);
      });

      teacherMap.forEach((teacherPeriods) => {
        if (teacherPeriods.length > 1) {
          conflicts.push(`${teacherPeriods[0].teacherName} has ${teacherPeriods.length} classes at ${teacherPeriods[0].startTime} on ${days[teacherPeriods[0].dayIndex]}`);
        }
      });
    });

    return conflicts;
  };

  const uniquePeriodNumbers = selectedTimetable
    ? Array.from(new Set(selectedTimetable.periods.map(p => p.periodNumber))).sort((a, b) => a - b)
    : [];

  const conflicts = checkTeacherConflict();

  // Auto-generation algorithm
  const generateTimetableAutomatically = (config: any) => {
    if (!selectedTimetable) return;

    const generatedPeriods: Period[] = [];
    let periodId = Date.now();

    // Subject frequency requirements (periods per week)
    const subjectFrequency: { [key: number]: number } = {
      1: 6, // Mathematics
      2: 5, // Physics
      3: 5, // Chemistry
      4: 5, // English
      5: 3, // History
      6: 3, // Geography
      7: 4, // Computer Science
      8: 2, // Physical Education
    };

    // Track teacher schedule to avoid conflicts
    const teacherSchedule: { [key: string]: boolean } = {};

    // Track subject usage per day to avoid consecutive same subjects
    const subjectUsagePerDay: { [key: number]: number[] } = {};

    const {
      periodsPerDay,
      startTime: baseStartTime,
      periodDuration,
      shortBreakAfter,
      shortBreakDuration,
      lunchBreakAfter,
      lunchBreakDuration,
      workingDays,
      avoidConsecutiveSame
    } = config;

    // Create a pool of subject slots based on frequency
    const subjectPool: number[] = [];
    Object.entries(subjectFrequency).forEach(([subjectId, frequency]) => {
      for (let i = 0; i < frequency; i++) {
        subjectPool.push(parseInt(subjectId));
      }
    });

    // Shuffle subjects for better distribution
    const shuffleArray = (array: number[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledSubjects = shuffleArray(subjectPool);
    let subjectIndex = 0;

    // Generate periods for each day
    for (let dayIndex = 0; dayIndex < workingDays; dayIndex++) {
      subjectUsagePerDay[dayIndex] = [];
      let currentTime = baseStartTime;
      let actualPeriodNumber = 1;

      for (let periodNum = 1; periodNum <= periodsPerDay; periodNum++) {
        const [hours, minutes] = currentTime.split(':').map(Number);

        // Add short break
        if (periodNum === shortBreakAfter + 1) {
          const breakEnd = new Date(0, 0, 0, hours, minutes + shortBreakDuration);
          generatedPeriods.push({
            id: periodId++,
            dayIndex,
            periodNumber: actualPeriodNumber++,
            startTime: currentTime,
            endTime: `${String(breakEnd.getHours()).padStart(2, '0')}:${String(breakEnd.getMinutes()).padStart(2, '0')}`,
            subjectId: 0,
            subjectName: 'Short Break',
            teacherId: 0,
            teacherName: '',
            roomNumber: '',
            type: 'break'
          });
          currentTime = `${String(breakEnd.getHours()).padStart(2, '0')}:${String(breakEnd.getMinutes()).padStart(2, '0')}`;
          continue;
        }

        // Add lunch break
        if (periodNum === lunchBreakAfter + 2) {
          const lunchEnd = new Date(0, 0, 0, hours, minutes + lunchBreakDuration);
          generatedPeriods.push({
            id: periodId++,
            dayIndex,
            periodNumber: actualPeriodNumber++,
            startTime: currentTime,
            endTime: `${String(lunchEnd.getHours()).padStart(2, '0')}:${String(lunchEnd.getMinutes()).padStart(2, '0')}`,
            subjectId: 0,
            subjectName: 'Lunch Break',
            teacherId: 0,
            teacherName: '',
            roomNumber: '',
            type: 'lunch'
          });
          currentTime = `${String(lunchEnd.getHours()).padStart(2, '0')}:${String(lunchEnd.getMinutes()).padStart(2, '0')}`;
          continue;
        }

        // Add class period
        if (subjectIndex < shuffledSubjects.length) {
          let subjectId = shuffledSubjects[subjectIndex];
          let attempts = 0;

          // Try to avoid consecutive same subjects if enabled
          if (avoidConsecutiveSame && subjectUsagePerDay[dayIndex].length > 0) {
            while (
              subjectUsagePerDay[dayIndex][subjectUsagePerDay[dayIndex].length - 1] === subjectId &&
              attempts < 10 &&
              subjectIndex < shuffledSubjects.length - 1
            ) {
              subjectIndex++;
              subjectId = shuffledSubjects[subjectIndex];
              attempts++;
            }
          }

          const subject = mockSubjects.find(s => s.id === subjectId);
          const teacher = mockTeachers[subjectId % mockTeachers.length];

          // Check teacher conflict
          const timeSlotKey = `${dayIndex}-${currentTime}-${teacher.id}`;
          const canAssign = !teacherSchedule[timeSlotKey];

          if (subject && canAssign) {
            const endTime = new Date(0, 0, 0, hours, minutes + periodDuration);
            const endTimeStr = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;

            generatedPeriods.push({
              id: periodId++,
              dayIndex,
              periodNumber: actualPeriodNumber++,
              startTime: currentTime,
              endTime: endTimeStr,
              subjectId: subject.id,
              subjectName: subject.name,
              teacherId: teacher.id,
              teacherName: teacher.name,
              roomNumber: `${200 + (subjectId % 10)}`,
              type: 'class'
            });

            teacherSchedule[timeSlotKey] = true;
            subjectUsagePerDay[dayIndex].push(subjectId);
            subjectIndex++;
            currentTime = endTimeStr;
          }
        }
      }
    }

    // Update the timetable with generated periods
    setSelectedTimetable({
      ...selectedTimetable,
      periods: generatedPeriods
    });

    // Update in the list
    setTimetables(timetables.map(tt =>
      tt.id === selectedTimetable.id
        ? { ...tt, periods: generatedPeriods }
        : tt
    ));

    setShowAutoGenModal(false);
  };

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
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Timetable Management</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage class schedules</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-white/50 hover:bg-white border border-white/40 rounded-xl text-gray-700 font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            New Timetable
          </button>
          <button
            className="px-4 py-2.5 bg-white/50 hover:bg-white border border-white/40 rounded-xl text-gray-700 font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <Copy size={18} />
          </button>
          <button
            className="px-4 py-2.5 bg-white/50 hover:bg-white border border-white/40 rounded-xl text-gray-700 font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <BarChart3 size={18} />
          </button>
          <button className="px-4 py-2.5 bg-white/50 hover:bg-white border border-white/40 rounded-xl text-gray-700 font-medium shadow-sm transition-all flex items-center gap-2">
            <Printer size={18} />
          </button>
          <button className="px-4 py-2.5 bg-white/50 hover:bg-white border border-white/40 rounded-xl text-gray-700 font-medium shadow-sm transition-all flex items-center gap-2">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Timetables</p>
              <p className="text-2xl font-bold text-gray-800">{timetables.filter(t => t.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Periods</p>
              <p className="text-2xl font-bold text-gray-800">{selectedTimetable?.periods.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Class Periods</p>
              <p className="text-2xl font-bold text-gray-800">{selectedTimetable?.periods.filter(p => p.type === 'class').length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${conflicts.length > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {conflicts.length > 0 ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div>
              <p className="text-sm text-gray-500">Conflicts</p>
              <p className="text-2xl font-bold text-gray-800">{conflicts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Selection */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between relative">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Selected Timetable</h3>
            <p className="text-sm text-gray-500 mt-1">Choose a class timetable to view or edit</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedTimetable?.id || ''}
                onChange={(e) => {
                  const tt = timetables.find(t => t.id === parseInt(e.target.value));
                  setSelectedTimetable(tt || null);
                }}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[250px]"
              >
                {timetables.map(tt => (
                  <option key={tt.id} value={tt.id}>
                    {tt.className} - {tt.sectionName} ({tt.academicYear})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800 mb-2">Teacher Schedule Conflicts Detected</h4>
              <ul className="space-y-1">
                {conflicts.map((conflict, idx) => (
                  <li key={idx} className="text-sm text-red-700">• {conflict}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      {selectedTimetable && (
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {selectedTimetable.className} - Section {selectedTimetable.sectionName}
              </h3>
              <p className="text-sm text-gray-500">Academic Year: {selectedTimetable.academicYear}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAutoGenModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <Wand2 size={18} />
                Auto-generate
              </button>
              <button
                onClick={() => setShowPeriodModal(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                Add Period
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-[120px_repeat(6,1fr)]">
                {/* Header Row */}
                <div className="p-4 bg-gray-50/80 border-b border-r border-gray-200 font-semibold text-gray-500 text-xs uppercase tracking-wider sticky left-0 z-10">
                  Period / Day
                </div>
                {days.map((day) => (
                  <div key={day} className="p-4 bg-gray-50/80 border-b border-gray-200 font-semibold text-gray-700 text-center text-sm">
                    {day}
                  </div>
                ))}

                {/* Period Rows */}
                {uniquePeriodNumbers.length > 0 ? uniquePeriodNumbers.map((periodNum) => (
                  <div key={periodNum} style={{ display: 'contents' }}>
                    {/* Period Number Column */}
                    <div className="p-4 bg-gray-50/50 border-r border-b border-gray-100 font-medium text-gray-600 text-sm flex items-center justify-center sticky left-0 z-10 backdrop-blur-sm">
                      Period {periodNum}
                    </div>

                    {/* Day Columns */}
                    {days.map((_, dayIndex) => {
                      const period = getPeriodForSlot(dayIndex, periodNum);
                      return (
                        <div key={`${dayIndex}-${periodNum}`} className="p-3 border-b border-r border-gray-100/50 min-h-[120px] relative group">
                          {period ? (
                            <div className={`w-full h-full rounded-xl p-3 border-2 shadow-sm hover:shadow-md transition-all relative ${period.type === 'break' ? 'bg-orange-50 border-orange-200' :
                                period.type === 'lunch' ? 'bg-green-50 border-green-200' :
                                  getSubjectColor(period.subjectId)
                              }`}>
                              {period.type === 'class' ? (
                                <>
                                  <p className="font-bold text-sm mb-1">{period.subjectName}</p>
                                  <p className="text-xs opacity-80">{period.teacherName}</p>
                                  <p className="text-xs opacity-70 mt-1">Room: {period.roomNumber}</p>
                                  <div className="flex items-center gap-1 mt-2 text-[10px] opacity-60">
                                    <Clock size={10} />
                                    <span>{period.startTime} - {period.endTime}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 justify-center h-full">
                                    <Coffee size={20} className={period.type === 'break' ? 'text-orange-600' : 'text-green-600'} />
                                    <div>
                                      <p className="font-bold text-sm">{period.subjectName}</p>
                                      <p className="text-[10px] opacity-60">{period.startTime} - {period.endTime}</p>
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={() => editPeriod(period)}
                                  className="p-1 bg-white rounded text-gray-600 hover:text-indigo-600 shadow-sm"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => deletePeriod(period.id)}
                                  className="p-1 bg-white rounded text-gray-600 hover:text-red-600 shadow-sm"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-xl border-2 border-dashed border-transparent hover:border-gray-300 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                              <button
                                onClick={() => {
                                  setQuickAddSlot({ day: dayIndex, period: periodNum.toString() });
                                  setShowPeriodModal(true);
                                }}
                                className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                              >
                                <Plus size={20} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )) : (
                  <div className="col-span-7 p-12 text-center text-gray-500 bg-white/10">
                    <div className="max-w-xs mx-auto">
                      <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                      <h4 className="text-lg font-bold text-gray-600 mb-1">No Schedule Found</h4>
                      <p className="text-sm text-gray-400 mb-6">Start building your timetable by adding periods or use auto-generation.</p>
                      <button
                        onClick={() => setShowPeriodModal(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20"
                      >
                        Add First Period
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TimetablePeriodModal
        isOpen={showPeriodModal}
        onClose={() => {
          setShowPeriodModal(false);
          setEditingPeriod(null);
          setQuickAddSlot(null);
        }}
        onSave={handleSavePeriod}
        editingPeriod={editingPeriod}
        days={days}
        subjects={mockSubjects}
        teachers={mockTeachers}
        initialDay={quickAddSlot?.day}
        initialPeriodNumber={quickAddSlot?.period}
      />

      <TimetableCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTimetable}
        classes={mockClasses}
      />

      <TimetableAutoGenModal
        isOpen={showAutoGenModal}
        onClose={() => setShowAutoGenModal(false)}
        onGenerate={generateTimetableAutomatically}
        initialConfig={autoGenConfig}
      />
    </div>
  );
};
