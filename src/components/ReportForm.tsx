import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Save,
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Building2,
  User,
  UserCheck,
  Settings2
} from 'lucide-react';
import { TrialReport, ProblemItem, ReportStatus, ProblemSeverity, ProblemStatus, AppConfig } from '../types';
import { generateIndustrialSvg, DEFAULT_APP_CONFIG } from '../mockData';
import { compressImageFile } from '../utils/imageCompressor';

interface ReportFormProps {
  initialReport?: TrialReport | null;
  onSave: (report: TrialReport) => void;
  onCancel: () => void;
  onPreview: (report: TrialReport) => void;
  config?: AppConfig;
  onOpenMasterData?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  initialReport,
  onSave,
  onCancel,
  onPreview,
  config,
  onOpenMasterData
}) => {
  const isEditing = !!initialReport;

  // Options from AppConfig Master Data or Defaults
  const customerList = (config?.customers && config.customers.length > 0)
    ? config.customers
    : (DEFAULT_APP_CONFIG.customers || ['Toyota (TMT)', 'Honda (HATC)', 'Isuzu (IMCT)', 'Nissan (NMT)', 'Ford (FTM)', 'Yamaha (TYM)']);

  const creatorList = (config?.creators && config.creators.length > 0)
    ? config.creators
    : (DEFAULT_APP_CONFIG.creators || ['วิศวกรฝ่ายผลิต (Production Engineer)', 'ช่างเทคนิค Jig & Tool (Tooling Tech)', 'สมชาย ใจดี (QA Lead)', 'ประสิทธิ์ วงศ์วิศว์ (Jig Engineer)']);

  const approverList = (config?.approvers && config.approvers.length > 0)
    ? config.approvers
    : (DEFAULT_APP_CONFIG.approvers || ['ผจก. แผนกวิศวกรรม (Engineering Manager)', 'ผจก. ฝ่ายผลิต (Production Manager)', 'ผู้อำนวยการโรงงาน (Plant Director)', 'หัวหน้าฝ่ายควบคุมคุณภาพ (QA Section Manager)']);

  const [reportNo, setReportNo] = useState(
    initialReport?.reportNo || `TR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
  );
  const [title, setTitle] = useState(initialReport?.title || 'Trial Report');
  const [jigSubAssy, setJigSubAssy] = useState(
    initialReport?.jigSubAssy || 'JIG : '
  );
  const [partName, setPartName] = useState(initialReport?.partName || '');
  const [partNumber, setPartNumber] = useState(initialReport?.partNumber || '');
  const [line, setLine] = useState(initialReport?.line || 'Welding Line 1');
  const [date, setDate] = useState(
    initialReport?.date || new Date().toISOString().split('T')[0]
  );
  const [trialRound, setTrialRound] = useState(initialReport?.trialRound || 'Trial #1');
  const [status, setStatus] = useState<ReportStatus>(initialReport?.status || 'Draft');

  // Customer, Creator, Approver (Dropdown selections)
  const [customer, setCustomer] = useState(
    initialReport?.customer || customerList[0] || 'Toyota (TMT)'
  );
  const [creator, setCreator] = useState(
    initialReport?.creator || initialReport?.author || creatorList[0] || 'วิศวกรฝ่ายผลิต (Production Engineer)'
  );
  const [approver, setApprover] = useState(
    initialReport?.approver || approverList[0] || 'ผจก. แผนกวิศวกรรม (Engineering Manager)'
  );
  const [approvalStatus, setApprovalStatus] = useState<'Pending' | 'Approved' | 'Rejected'>(
    initialReport?.approvalStatus || 'Pending'
  );

  // Header Images
  const [headerImage1, setHeaderImage1] = useState(
    initialReport?.headerImage1 || generateIndustrialSvg('jig_main')
  );
  const [headerImage1Caption, setHeaderImage1Caption] = useState(
    initialReport?.headerImage1Caption || 'ภาพรวม JIG'
  );
  const [headerImage2, setHeaderImage2] = useState(
    initialReport?.headerImage2 || generateIndustrialSvg('pipe_hand')
  );
  const [headerImage2Caption, setHeaderImage2Caption] = useState(
    initialReport?.headerImage2Caption || 'จุดตรวจสอบชิ้นงาน'
  );

  // Key Problems Summary ("สรุป ปัญหาหลัก")
  const [summaryList, setSummaryList] = useState<string[]>(
    initialReport?.keyProblemsSummary || [
      '1. ออกแบบ Jig Setting Control Pipe 3 mm',
      '2. ออกแบบ ตัวช่วยประคอง หรือ ตัวยึด ใหม่'
    ]
  );

  // Problems List (1 - 5)
  const [problems, setProblems] = useState<ProblemItem[]>(
    initialReport?.problems?.slice(0, 5) || [
      {
        id: 'p-initial-1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- ไม่มี Jig Setting ระยะ Control 3 mm',
        countermeasure: '- ออกแบบ Jig Setting ใหม่',
        images: [generateIndustrialSvg('cad_drawing')],
        imageCaptions: ['แบบระยะ 3 mm'],
        severity: 'High',
        status: 'In Progress'
      },
      {
        id: 'p-initial-2',
        orderNumber: 2,
        title: '2. ปัญหาที่พบ',
        description: '- Support บังจุดที่ต้อง เชื่อมแต้ม',
        countermeasure: '- ถอด Support จุดบัง เชื่อมแต้มออก ไม่มีผลต่อการประกอบ',
        images: [generateIndustrialSvg('support_weld')],
        imageCaptions: ['จุด Support บังแนวเชื่อม'],
        severity: 'Medium',
        status: 'Solved'
      }
    ]
  );

  // Add Problem (Max 5)
  const handleAddProblem = () => {
    if (problems.length >= 5) {
      alert('รายงาน 1 ฉบับสามารถระบุปัญหาได้สูงสุด 5 ปัญหา เพื่อการจัดสรรหน้าแนวนอน 1 หน้าได้อย่างสมบูรณ์ (Max 5 problems)');
      return;
    }
    const nextOrder = problems.length + 1;
    const newProblem: ProblemItem = {
      id: `p-${Date.now()}-${nextOrder}`,
      orderNumber: nextOrder,
      title: `${nextOrder}. ปัญหาที่พบ`,
      description: '- รายละเอียดปัญหาที่ตรวจพบ...',
      countermeasure: '- แนวทางแก้ไข / มาตรการตอบโต้...',
      images: [generateIndustrialSvg('weld_defect')],
      imageCaptions: ['รูปภาพประกอบปัญหา'],
      severity: 'Medium',
      status: 'Pending'
    };
    setProblems([...problems, newProblem]);

    // Update summary suggestion if needed
    setSummaryList([
      ...summaryList,
      `${nextOrder}. มาตรการแก้ไขปัญหาข้อที่ ${nextOrder}`
    ]);
  };

  // Remove Problem (Min 1)
  const handleRemoveProblem = (index: number) => {
    if (problems.length <= 1) {
      alert('ต้องมีปัญหาอย่างน้อย 1 รายการในรายงาน (Minimum 1 problem required)');
      return;
    }
    const updated = problems
      .filter((_, idx) => idx !== index)
      .map((p, idx) => ({
        ...p,
        orderNumber: idx + 1,
        title: `${idx + 1}. ปัญหาที่พบ`
      }));
    setProblems(updated);
  };

  // Update Problem Field
  const handleUpdateProblem = (
    index: number,
    field: keyof ProblemItem,
    value: any
  ) => {
    const updated = [...problems];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setProblems(updated);
  };

  // Handle Image Upload Helper with automatic compression
  const handleImageFile = (
    onSuccess: (url: string) => void
  ) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('ขนาดไฟล์เกิน 20MB กรุณาเลือกไฟล์ที่เล็กลง');
        return;
      }
      try {
        const compressedUrl = await compressImageFile(file, 1024, 1024, 0.72);
        onSuccess(compressedUrl);
      } catch (err) {
        console.error('Image compression error, falling back to FileReader:', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          onSuccess(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Auto sync summary list from problems
  const handleAutoGenerateSummary = () => {
    const generated = problems.map((p, idx) => {
      const firstLineCounter = p.countermeasure.split('\n')[0].replace(/^-\s*/, '');
      return `${idx + 1}. ${firstLineCounter || 'ดำเนินมาตรการแก้ไข'}`;
    });
    setSummaryList(generated);
  };

  // Build current report object
  const buildReportObject = (): TrialReport => {
    return {
      id: initialReport?.id || `TR-${Date.now()}`,
      reportNo,
      title,
      jigSubAssy,
      partName,
      partNumber,
      line,
      date,
      author: creator || 'ผู้จัดทำ',
      creator: creator || 'ผู้จัดทำ',
      customer: customer || '',
      approver: approver || '',
      approvalStatus,
      approvedDate: approvalStatus === 'Approved' ? (initialReport?.approvedDate || date) : null,
      approvedBy: approvalStatus === 'Approved' ? (initialReport?.approvedBy || approver) : null,
      approvalRemark: initialReport?.approvalRemark || null,
      trialRound,
      status: status || 'Draft',
      headerImage1,
      headerImage1Caption: headerImage1Caption || '',
      headerImage2,
      headerImage2Caption: headerImage2Caption || '',
      keyProblemsSummary: summaryList.filter(s => s.trim().length > 0),
      problems,
      comments: initialReport?.comments || [],
      createdAt: initialReport?.createdAt || new Date().toLocaleString('th-TH'),
      updatedAt: new Date().toLocaleString('th-TH')
    };
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jigSubAssy.trim()) {
      alert('กรุณาระบุ JIG Name');
      return;
    }
    const finalReport = buildReportObject();
    onSave(finalReport);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Form Header */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={onCancel}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#1e3a8a] mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้ารายการ (Back to Reports)</span>
          </button>
          <h2 className="text-xl font-bold text-[#0f2b5c] flex items-center gap-2">
            <span>{isEditing ? 'แก้ไขรายงาน Trial Report (Edit Report)' : 'สร้างรายงาน Trial Report (Create Report)'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
              Admin Mode
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ระบุข้อมูลและปัญหา 1-5 ปัญหา ระบบจะจัดสรรลงหน้าแนวนอน 1 หน้า (1-Page Landscape) ให้อัตโนมัติ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onPreview(buildReportObject())}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
          >
            <Eye className="w-4 h-4 text-[#1e3a8a]" />
            <span>Preview 1-Page Landscape (ดูตัวอย่าง 1 หน้า)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-bold shadow-xs transition"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>{isEditing ? 'บันทึกการแก้ไข (Update Report)' : 'บันทึกรายงาน (Save Report)'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveClick} className="space-y-6">
        {/* Section 1: Basic Information & Document Header */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="text-sm font-bold text-[#0f2b5c] uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
              1. ข้อมูลส่วนหัวรายงาน (Header Information)
            </h3>
            <div className="flex items-center gap-3">
              {onOpenMasterData && (
                <button
                  type="button"
                  onClick={onOpenMasterData}
                  className="flex items-center gap-1 text-xs text-[#1e3a8a] hover:text-blue-900 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition cursor-pointer border border-blue-200"
                  title="คลิกเพื่อจัดการรายชื่อลูกค้า ผู้จัดทำ และผู้อนุมัติ"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>จัดการข้อมูลตัวเลือก (Master Data)</span>
                </button>
              )}
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">ส่วนหัวจะแสดงบนหัวกระดาษ 1 หน้า แนวนอน</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Row 1: Key Identifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Report No. (เลขที่รายงาน) *
                </label>
                <input
                  type="text"
                  required
                  value={reportNo}
                  onChange={(e) => setReportNo(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  JIG Name *
                </label>
                <input
                  type="text"
                  required
                  value={jigSubAssy}
                  onChange={(e) => setJigSubAssy(e.target.value)}
                  placeholder="เช่น JIG : Floor Panel Cross Member"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Part Name (ชื่อชิ้นงาน)
                </label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="e.g. Pipe Assembly / Bracket"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Part Number (หมายเลขชิ้นงาน)
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="e.g. RB-4491-A"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            {/* Row 2: Production & Test Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Line / Area (สายการผลิต)
                </label>
                <input
                  type="text"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  placeholder="e.g. Welding Line 3 (KKM)"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date (วันที่ทดสอบ)
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trial Round (รอบการทดสอบ)
                </label>
                <select
                  value={trialRound}
                  onChange={(e) => setTrialRound(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="Trial #1">Trial #1 (รอบที่ 1)</option>
                  <option value="Trial #2">Trial #2 (รอบที่ 2)</option>
                  <option value="Trial #3">Trial #3 (รอบที่ 3)</option>
                  <option value="Pilot Run">Pilot Run (ทดลองผลิต)</option>
                  <option value="Mass Production Trial">Mass Production Trial</option>
                </select>
              </div>
            </div>

            {/* Row 3: Customer, Creator, and Approve Report (Dropdown selections as requested) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-100 bg-slate-50/60 p-3 rounded-xl border">
              {/* Customer Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#0f2b5c]">
                    <Building2 className="w-3.5 h-3.5 text-[#1e3a8a]" />
                    <span>Customer (ลูกค้า) *</span>
                  </span>
                  {onOpenMasterData && (
                    <button
                      type="button"
                      onClick={onOpenMasterData}
                      className="text-[10px] text-[#1e3a8a] hover:underline font-semibold"
                    >
                      + จัดการ
                    </button>
                  )}
                </label>
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  {customerList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {!customerList.includes(customer) && (
                    <option value={customer}>{customer}</option>
                  )}
                </select>
              </div>

              {/* Creator Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#0f2b5c]">
                    <User className="w-3.5 h-3.5 text-[#1e3a8a]" />
                    <span>Creator (ผู้จัดทำรายงาน) *</span>
                  </span>
                  {onOpenMasterData && (
                    <button
                      type="button"
                      onClick={onOpenMasterData}
                      className="text-[10px] text-[#1e3a8a] hover:underline font-semibold"
                    >
                      + จัดการ
                    </button>
                  )}
                </label>
                <select
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  {creatorList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {!creatorList.includes(creator) && (
                    <option value={creator}>{creator}</option>
                  )}
                </select>
              </div>

              {/* Approve Report Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#0f2b5c]">
                    <UserCheck className="w-3.5 h-3.5 text-[#1e3a8a]" />
                    <span>Approve Report (ผู้อนุมัติ) *</span>
                  </span>
                  {onOpenMasterData && (
                    <button
                      type="button"
                      onClick={onOpenMasterData}
                      className="text-[10px] text-[#1e3a8a] hover:underline font-semibold"
                    >
                      + จัดการ
                    </button>
                  )}
                </label>
                <select
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  {approverList.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                  {!approverList.includes(approver) && (
                    <option value={approver}>{approver}</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Header Images & สรุป ปัญหาหลัก (Key Problems Summary) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="text-sm font-bold text-[#0f2b5c] uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
              2. รูปภาพส่วนหัว และ สรุปปัญหาหลัก (Header Visuals & Summary)
            </h3>
            <button
              type="button"
              onClick={handleAutoGenerateSummary}
              className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-Generate สรุปปัญหาหลักจากรายการปัญหา</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Header Image 1: Main Jig photo */}
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  รูปภาพหลัก JIG (Header Image 1)
                </span>
                <div className="w-full h-36 bg-white rounded border border-slate-200 flex items-center justify-center overflow-hidden mb-2 relative">
                  <img
                    src={headerImage1}
                    alt="Header 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={headerImage1Caption}
                  onChange={(e) => setHeaderImage1Caption(e.target.value)}
                  placeholder="คำบรรยายรูป (Caption)"
                  className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs"
                />
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-medium cursor-pointer">
                    <Upload className="w-3 h-3 text-[#1e3a8a]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile((url) => setHeaderImage1(url))}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setHeaderImage1(generateIndustrialSvg('jig_main'))}
                    className="px-2 py-1.5 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium"
                  >
                    Preset Jig
                  </button>
                </div>
              </div>
            </div>

            {/* Header Image 2: Secondary / Operator photo */}
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  รูปภาพประกอบรอง / ท่อชิ้นงาน (Header Image 2)
                </span>
                <div className="w-full h-36 bg-white rounded border border-slate-200 flex items-center justify-center overflow-hidden mb-2 relative">
                  <img
                    src={headerImage2}
                    alt="Header 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={headerImage2Caption}
                  onChange={(e) => setHeaderImage2Caption(e.target.value)}
                  placeholder="คำบรรยายรูป (Caption)"
                  className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs"
                />
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-medium cursor-pointer">
                    <Upload className="w-3 h-3 text-[#1e3a8a]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile((url) => setHeaderImage2(url))}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setHeaderImage2(generateIndustrialSvg('pipe_hand'))}
                    className="px-2 py-1.5 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium"
                  >
                    Preset Pipe
                  </button>
                </div>
              </div>
            </div>

            {/* สรุป ปัญหาหลัก (Key Problems Summary) */}
            <div className="border border-slate-200 rounded-lg p-3 bg-amber-50/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#92400e] block mb-1">
                  สรุป ปัญหาหลัก (Key Problems Summary)
                </span>
                <p className="text-[11px] text-slate-500 mb-2">
                  จะแสดงที่มุมขวาบนของรายงานใน 1 หน้า แนวนอน
                </p>
                <div className="space-y-2">
                  {summaryList.map((item, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...summaryList];
                          updated[sIdx] = e.target.value;
                          setSummaryList(updated);
                        }}
                        className="flex-1 px-2.5 py-1 border border-slate-300 rounded text-xs font-semibold text-[#0f2b5c] bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setSummaryList(summaryList.filter((_, idx) => idx !== sIdx))}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSummaryList([...summaryList, `${summaryList.length + 1}. ข้อความสรุปปัญหาหลัก`])}
                className="mt-3 w-full py-1 text-xs text-[#92400e] hover:bg-amber-100/60 rounded border border-dashed border-amber-300 font-medium transition"
              >
                + เพิ่มข้อความสรุป (Add Summary Item)
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Problems & Countermeasures Builder (1 to 5 Problems) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#0f2b5c] uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
                3. รายการปัญหาและแนวทางแก้ไข (Problems 1 - 5 Items)
              </h3>
              <p className="text-xs text-slate-500">
                ปัจจุบันมี <strong>{problems.length}</strong> ปัญหา (รองรับ 1 ถึง 5 ปัญหา จัดสัดส่วนอัตโนมัติ)
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddProblem}
              disabled={problems.length >= 5}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                problems.length >= 5
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ เพิ่มปัญหา (Add Problem) {problems.length}/5</span>
            </button>
          </div>

          {/* Cards for each problem */}
          <div className="space-y-4">
            {problems.map((problem, pIdx) => (
              <div
                key={problem.id}
                className="border-2 border-slate-200 rounded-xl p-4 bg-white hover:border-[#1e3a8a]/40 transition space-y-3"
              >
                {/* Header of problem item */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                      {pIdx + 1}
                    </span>
                    <span className="text-sm font-bold text-[#dc2626]">
                      {pIdx + 1}. ปัญหาที่พบ (Problem #{pIdx + 1})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={problem.severity}
                      onChange={(e) => handleUpdateProblem(pIdx, 'severity', e.target.value as ProblemSeverity)}
                      className="text-xs px-2 py-0.5 border border-slate-300 rounded font-semibold text-slate-700"
                    >
                      <option value="High">Urgent (ด่วนมาก)</option>
                      <option value="Medium">Medium (ปานกลาง)</option>
                      <option value="Low">Low (ปกติ)</option>
                    </select>

                    <select
                      value={problem.status}
                      onChange={(e) => handleUpdateProblem(pIdx, 'status', e.target.value as ProblemStatus)}
                      className="text-xs px-2 py-0.5 border border-slate-300 rounded font-semibold text-slate-700"
                    >
                      <option value="Pending">Pending (รอดำเนินการ)</option>
                      <option value="In Progress">In Progress (กำลังดำเนินการ)</option>
                      <option value="Solved">Solved (แก้ไขแล้ว)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveProblem(pIdx)}
                      disabled={problems.length <= 1}
                      className={`p-1 text-slate-400 hover:text-red-600 transition ${
                        problems.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                      title="ลบปัญหานี้ (Remove Problem)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Red Problem & Green Countermeasure inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Red: ปัญหาที่พบ */}
                  <div>
                    <label className="block text-xs font-bold text-[#dc2626] mb-1">
                      รายละเอียด: {pIdx + 1}. ปัญหาที่พบ (Problem Description)
                    </label>
                    <textarea
                      rows={3}
                      value={problem.description}
                      onChange={(e) => handleUpdateProblem(pIdx, 'description', e.target.value)}
                      placeholder="- เช่น ไม่มี Jig Setting ระยะ Control 3 mm"
                      className="w-full px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-[#0f2b5c] bg-red-50/20 focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Green: แก้ไข */}
                  <div>
                    <label className="block text-xs font-bold text-[#15803d] mb-1">
                      รายละเอียด: แก้ไข (Countermeasure / Solution)
                    </label>
                    <textarea
                      rows={3}
                      value={problem.countermeasure}
                      onChange={(e) => handleUpdateProblem(pIdx, 'countermeasure', e.target.value)}
                      placeholder="- เช่น ออกแบบ Jig Setting ใหม่"
                      className="w-full px-3 py-1.5 border border-emerald-200 rounded-lg text-xs font-medium text-[#0f2b5c] bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Problem Images & Drawings */}
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-xs font-bold text-slate-700 mb-2">
                    รูปภาพประกอบปัญหา #{pIdx + 1} (Drawing / Defect Photo / CAD with Red Circle)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {problem.images.map((imgUrl, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex flex-col justify-between"
                      >
                        <div className="w-full h-24 bg-white rounded border border-slate-200 overflow-hidden mb-2 relative">
                          <img
                            src={imgUrl}
                            alt="Problem image"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <input
                          type="text"
                          value={problem.imageCaptions?.[imgIdx] || ''}
                          onChange={(e) => {
                            const currentCaptions = [...(problem.imageCaptions || [])];
                            currentCaptions[imgIdx] = e.target.value;
                            handleUpdateProblem(pIdx, 'imageCaptions', currentCaptions);
                          }}
                          placeholder="คำบรรยายรูป (Caption)"
                          className="w-full px-2 py-0.5 border border-slate-300 rounded text-[10px] mb-1.5"
                        />
                        <div className="flex items-center gap-1.5">
                          <label className="flex-1 flex items-center justify-center gap-1 py-1 bg-white border border-slate-300 rounded text-[10px] cursor-pointer hover:bg-slate-100">
                            <Upload className="w-2.5 h-2.5 text-[#1e3a8a]" />
                            <span>เปลี่ยนรูป</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFile((newUrl) => {
                                const newImages = [...problem.images];
                                newImages[imgIdx] = newUrl;
                                handleUpdateProblem(pIdx, 'images', newImages);
                              })}
                              className="hidden"
                            />
                          </label>
                          {problem.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = problem.images.filter((_, idx) => idx !== imgIdx);
                                handleUpdateProblem(pIdx, 'images', newImages);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add another image if under 2 images */}
                    {problem.images.length < 2 && (
                      <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50 flex flex-col items-center justify-center text-center">
                        <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-[11px] text-slate-500 font-medium mb-2">
                          เพิ่มรูปภาพรูปที่ 2 (CAD / ชิ้นงาน)
                        </span>
                        <div className="flex gap-1.5">
                          <label className="px-2.5 py-1 bg-[#1e3a8a] text-white rounded text-[10px] font-semibold cursor-pointer hover:bg-blue-900">
                            <span>อัพโหลดรูป</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFile((newUrl) => {
                                handleUpdateProblem(pIdx, 'images', [...problem.images, newUrl]);
                              })}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateProblem(pIdx, 'images', [
                                ...problem.images,
                                generateIndustrialSvg('cad_drawing')
                              ]);
                            }}
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] font-medium hover:bg-slate-300"
                          >
                            Preset CAD
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save & Preview Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            ยกเลิก (Cancel)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(buildReportObject())}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            >
              Preview 1-Page Landscape
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>{isEditing ? 'บันทึกการแก้ไข (Update)' : 'สร้างรายงาน (Create Report)'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
