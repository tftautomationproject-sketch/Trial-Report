import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  Calendar,
  UserCheck,
  AlertCircle,
  FileCheck,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { TrialReport, AppConfig } from '../types';

interface ApprovalModalProps {
  report: TrialReport | null;
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (reportId: string, approverName: string, remark?: string) => Promise<void> | void;
  onRevokeApproval?: (reportId: string) => Promise<void> | void;
}

const APPROVER_PASSCODE = '0096';

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  report,
  config,
  isOpen,
  onClose,
  onApprove,
  onRevokeApproval
}) => {
  if (!isOpen || !report) return null;

  const isAlreadyApproved = report.approvalStatus === 'Approved';

  // Approver selection list
  const approverOptions = config?.approvers && config.approvers.length > 0
    ? config.approvers
    : ['ผจก. แผนกวิศวกรรม (Engineering Manager)', 'ผจก. ฝ่ายผลิต (Production Manager)', 'ผู้อำนวยการโรงงาน (Plant Director)', 'หัวหน้าฝ่ายควบคุมคุณภาพ (QA Section Manager)'];

  // Form State
  const [approverName, setApproverName] = useState<string>(
    report.approver || report.approvedBy || approverOptions[0] || ''
  );
  const [passcode, setPasscode] = useState('');
  const [remark, setRemark] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRevokeSection, setShowRevokeSection] = useState(false);
  const [revokePasscode, setRevokePasscode] = useState('');
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const handleClose = () => {
    setPasscode('');
    setRemark('');
    setError(null);
    setShowRevokeSection(false);
    setRevokePasscode('');
    setRevokeError(null);
    onClose();
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approverName.trim()) {
      setError('กรุณาระบุชื่อผู้อนุมัติ');
      return;
    }

    if (passcode !== APPROVER_PASSCODE) {
      setError('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      setPasscode('');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onApprove(report.id, approverName.trim(), remark.trim() || undefined);
      handleClose();
    } catch (err) {
      console.error('Approval submission error:', err);
      setError('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (revokePasscode !== APPROVER_PASSCODE) {
      setRevokeError('รหัสผ่านไม่ถูกต้อง ไม่สามารถยกเลิกการอนุมัติได้');
      setRevokePasscode('');
      return;
    }

    if (!onRevokeApproval) return;

    setIsSubmitting(true);
    setRevokeError(null);

    try {
      await onRevokeApproval(report.id);
      handleClose();
    } catch (err) {
      console.error('Revoke approval error:', err);
      setRevokeError('เกิดข้อผิดพลาดในการยกเลิกการอนุมัติ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isAlreadyApproved 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                : 'bg-blue-50 border border-blue-200 text-[#1e3a8a]'
            }`}>
              {isAlreadyApproved ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#1e3a8a]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{isAlreadyApproved ? 'ข้อมูลการอนุมัติรายงาน' : 'อนุมัติรายงาน (Approve Report)'}</span>
                {isAlreadyApproved ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    APPROVED
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                    PENDING
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {report.reportNo} • {report.jigSubAssy}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Overview Box */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">เลขที่รายงาน:</span>
            <span className="font-bold font-mono text-[#0f2b5c]">{report.reportNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ชิ้นงาน / Part:</span>
            <span className="font-semibold text-slate-800">{report.partName || '-'} ({report.partNumber || '-'})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ลูกค้า / รอบทดสอบ:</span>
            <span className="font-semibold text-slate-800">{report.customer || '-'} • {report.trialRound}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ผู้จัดทำ (Creator):</span>
            <span className="font-semibold text-slate-800">{report.creator || report.author}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ผู้อนุมัติตามรายงาน (Designated Approver):</span>
            <span className="font-bold text-[#1e3a8a]">{report.approver || 'ยังไม่ระบุ'}</span>
          </div>
        </div>

        {/* Case 1: Already Approved */}
        {isAlreadyApproved ? (
          <div className="space-y-4">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>รายงานนี้ได้รับการอนุมัติเรียบร้อยแล้ว (Approved)</span>
              </div>
              <div className="space-y-1 pl-6 text-slate-700">
                <div>
                  ผู้อนุมัติ: <strong className="text-slate-900">{report.approvedBy || report.approver}</strong>
                </div>
                {report.approvedDate && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>วันที่อนุมัติ: <strong className="text-slate-800">{report.approvedDate}</strong></span>
                  </div>
                )}
                {report.approvalRemark && (
                  <div className="mt-1 pt-1 border-t border-emerald-200/60 text-slate-600 italic">
                    ข้อคิดเห็น: "{report.approvalRemark}"
                  </div>
                )}
              </div>
            </div>

            {/* Revoke approval toggle */}
            {!showRevokeSection ? (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRevokeSection(true)}
                  className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ต้องการยกเลิกการอนุมัติ (เพื่อแก้ไขรายงาน)?</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            ) : (
              <form onSubmit={handleRevokeSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                    <span>ยกเลิกการอนุมัติรายงาน (Revoke Approval)</span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    สถานะรายงานจะกลับเป็น "รออนุมัติ (Pending)" กรุณากรอกรหัสผ่านเพื่อยืนยัน
                  </p>
                  <div>
                    <input
                      type="password"
                      value={revokePasscode}
                      onChange={(e) => {
                        setRevokePasscode(e.target.value);
                        if (revokeError) setRevokeError(null);
                      }}
                      placeholder="กรุณากรอกรหัสผ่านยืนยัน"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono text-center focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      maxLength={10}
                    />
                  </div>
                  {revokeError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{revokeError}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRevokeSection(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs hover:bg-slate-100 transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={!revokePasscode || isSubmitting}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันยกเลิกการอนุมัติ'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Case 2: Pending Approval - Form to Approve */
          <form onSubmit={handleApproveSubmit} className="space-y-4">
            {/* Approver Name Selection / Confirmation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span>ชื่อผู้อนุมัติ (Approver Name)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="approver-options-list"
                  value={approverName}
                  onChange={(e) => {
                    setApproverName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="ระบุชื่อหรือเลือกตำแหน่งผู้อนุมัติ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
                <datalist id="approver-options-list">
                  {approverOptions.map((opt, i) => (
                    <option key={i} value={opt} />
                  ))}
                </datalist>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                เริ่มต้นตามชื่อผู้อนุมัติที่ระบุไว้ในเอกสาร หรือพิมพ์ชื่อผู้อนุมัติจริง
              </p>
            </div>

            {/* Optional Remark / Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>ความเห็นหรือคำแนะนำจากผู้อนุมัติ (Optional Remark)</span>
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={2}
                placeholder="เช่น เห็นชอบตามมาตรการแก้ไข, อนุญาตให้ดำเนินการสร้าง Jig Setting ได้"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            {/* Approver Passcode (Required) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>รหัสผ่านสำหรับทำการ Approve</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  maxLength={10}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="กรุณากรอกรหัสผ่านผู้อนุมัติ"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-center font-mono text-base tracking-widest transition focus:outline-none focus:ring-2 ${
                    error
                      ? 'border-red-500 ring-2 ring-red-200 bg-red-50/50 text-red-900'
                      : 'border-slate-300 focus:border-[#1e3a8a] focus:ring-blue-100 bg-slate-50/50'
                  }`}
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-600 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-slate-300 text-[#1e3a8a] focus:ring-blue-500"
                  />
                  <span>แสดงรหัส</span>
                </label>
                <span className="text-slate-400">Security Verification</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={!passcode.trim() || isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'กำลังบันทึก...' : 'อนุมัติรายงาน (Approve)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
