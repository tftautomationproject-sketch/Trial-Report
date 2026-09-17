import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { TrialReport } from '../types';

interface DeleteConfirmModalProps {
  report: TrialReport | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  report,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Danger Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ยืนยันการลบรายงาน
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Confirm Report Deletion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Details Box */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Report No. (เลขที่รายงาน):</span>
            <span className="font-mono font-bold text-[#0f2b5c] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {report.reportNo}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">JIG Name:</span>
            <span className="font-bold text-slate-800 text-right truncate max-w-[220px]">
              {report.jigSubAssy || '-'}
            </span>
          </div>
          {report.partName && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Part Name:</span>
              <span className="font-medium text-slate-700 text-right truncate max-w-[220px]">
                {report.partName}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Problems:</span>
            <span className="font-bold text-red-600">
              {report.problems.length} รายการ
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          คุณแน่ใจหรือไม่ว่าต้องการลบรายงานนี้ออกจากระบบ? เมื่อยืนยันแล้วข้อมูลรายงานทั้งหมดจะถูกลบออกถาวรและไม่สามารถกู้คืนได้
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
          >
            ยกเลิก (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ยืนยันการลบ (Delete Permanently)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
