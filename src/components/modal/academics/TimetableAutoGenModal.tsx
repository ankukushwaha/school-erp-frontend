import React, { useState } from 'react';
import {
  X,
  Wand2,
  Clock,
  Settings,
  ChevronDown
} from 'lucide-react';

interface TimetableAutoGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: any) => void;
  initialConfig: any;
}

export const TimetableAutoGenModal: React.FC<TimetableAutoGenModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  initialConfig
}) => {
  const [config, setConfig] = useState(initialConfig);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border border-white/20 shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Auto-generate Timetable</h3>
            <p className="text-sm text-gray-500">Configure parameters for automatic schedule generation</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Periods Per Day <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={config.periodsPerDay}
                onChange={(e) => setConfig({ ...config, periodsPerDay: parseInt(e.target.value) })}
                placeholder="7"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Working Days <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={config.workingDays}
                onChange={(e) => setConfig({ ...config, workingDays: parseInt(e.target.value) })}
                placeholder="6"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={config.startTime}
                  onChange={(e) => setConfig({ ...config, startTime: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Period Duration (min) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={config.periodDuration}
                onChange={(e) => setConfig({ ...config, periodDuration: parseInt(e.target.value) })}
                placeholder="45"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                required
              />
            </div>
          </div>

          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-4">
            <h4 className="text-sm font-bold text-orange-800 flex items-center gap-2">
              <Settings size={16} />
              Break Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Short Break After Period
                </label>
                <input
                  type="number"
                  value={config.shortBreakAfter}
                  onChange={(e) => setConfig({ ...config, shortBreakAfter: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Short Break Duration (min)
                </label>
                <input
                  type="number"
                  value={config.shortBreakDuration}
                  onChange={(e) => setConfig({ ...config, shortBreakDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Lunch Break After Period
                </label>
                <input
                  type="number"
                  value={config.lunchBreakAfter}
                  onChange={(e) => setConfig({ ...config, lunchBreakAfter: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Lunch Break Duration (min)
                </label>
                <input
                  type="number"
                  value={config.lunchBreakDuration}
                  onChange={(e) => setConfig({ ...config, lunchBreakDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Subject Distribution <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={config.subjectDistribution}
                  onChange={(e) => setConfig({ ...config, subjectDistribution: e.target.value as 'balanced' | 'priority' })}
                  className="appearance-none w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700"
                  required
                >
                  <option value="balanced">Balanced</option>
                  <option value="priority">Priority</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Avoid Consecutive Same Subjects
              </label>
              <div className="flex gap-3">
                {(['true', 'false'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setConfig({ ...config, avoidConsecutiveSame: value === 'true' })}
                    className={`flex-1 py-3 rounded-2xl border-2 font-bold transition-all ${config.avoidConsecutiveSame === (value === 'true')
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                  >
                    {value === 'true' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
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
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Wand2 size={18} />
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
