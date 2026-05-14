import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';

interface ReportRemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classRemarks: string, principalRemarks: string) => void;
  report: any;
}

export const ReportRemarksModal: React.FC<ReportRemarksModalProps> = ({
  isOpen,
  onClose,
  onSave,
  report,
}) => {
  const [classTeacherRemarks, setClassTeacherRemarks] = useState('');
  const [principalRemarks, setPrincipalRemarks] = useState('');

  useEffect(() => {
    if (report) {
      setClassTeacherRemarks(report.classTeacherRemarks);
      setPrincipalRemarks(report.principalRemarks);
    }
  }, [report, isOpen]);

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(classTeacherRemarks, principalRemarks);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="bg-gray-900 p-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Update Insights</h3>
            <p className="text-gray-400 text-xs font-bold mt-1">FOR {report.studentName.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Class Teacher's Evaluative Remarks
            </label>
            <textarea 
              value={classTeacherRemarks}
              onChange={(e) => setClassTeacherRemarks(e.target.value)}
              rows={4}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-medium text-gray-700"
              placeholder="Share your detailed observations about the student's progress..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Principal's Strategic Remarks
            </label>
            <textarea 
              value={principalRemarks}
              onChange={(e) => setPrincipalRemarks(e.target.value)}
              rows={4}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-medium text-gray-700"
              placeholder="Principal's feedback or recommendations..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white border-2 border-gray-200 rounded-2xl font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Save size={20} />
              Save & Update Remarks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
