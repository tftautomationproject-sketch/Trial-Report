import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  MessageSquare,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { TrialReport, UserRole, ReportStatus } from '../types';

interface ReportListProps {
  reports: TrialReport[];
  role: UserRole;
  onViewReport: (report: TrialReport) => void;
  onEditReport: (report: TrialReport) => void;
  onDeleteReport: (report: TrialReport) => void;
  onDuplicateReport: (report: TrialReport) => void;
  onOpenComments: (report: TrialReport) => void;
  onCreateNew: () => void;
  onOpenApproval: (report: TrialReport) => void;
}

export const ReportList: React.FC<ReportListProps> = ({
  reports,
  role,
  onViewReport,
  onEditReport,
  onDeleteReport,
  onDuplicateReport,
  onOpenComments,
  onCreateNew,
  onOpenApproval
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblemCount, setSelectedProblemCount] = useState<string>('ALL');
  const [selectedApprovalFilter, setSelectedApprovalFilter] = useState<'ALL' | 'Approved' | 'Pending'>('ALL');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Filter logic
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.reportNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.jigSubAssy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.customer && r.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.creator && r.creator.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.approver && r.approver.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProblemCount =
      selectedProblemCount === 'ALL' ||
      r.problems.length === parseInt(selectedProblemCount, 10);

    const isApproved = r.approvalStatus === 'Approved';
    const matchesApproval =
      selectedApprovalFilter === 'ALL' ||
      (selectedApprovalFilter === 'Approved' && isApproved) ||
      (selectedApprovalFilter === 'Pending' && !isApproved);

    return matchesSearch && matchesProblemCount && matchesApproval;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertTriangle className="w-3 h-3" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Title & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2b5c] flex items-center gap-2">
            <span>Report List (รายการรายงานทั้งหมด)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1e3a8a] border border-blue-200 font-bold">
              {filteredReports.length} รายการ
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ค้นหาและจัดการเอกสาร Trial Report พร้อมส่งออกหน้าแนวนอน (1-Page Landscape Export)
          </p>
        </div>

        {role === 'Admin' ? (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
          >
            <span>+ สร้างรายงานใหม่ (Create Report)</span>
          </button>
        ) : (
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            โหมด User: ดูรายงานและแสดงความคิดเห็น (Comment) ได้
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาเลขที่รายงาน, JIG Name, Part Name, P/No..."
              className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          {/* Problem Count Filter (1-5) */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">จำนวนปัญหา:</span>
            <select
              value={selectedProblemCount}
              onChange={(e) => setSelectedProblemCount(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white"
            >
              <option value="ALL">All Problems (ทุกรายการ)</option>
              <option value="1">1 ปัญหา (1 Problem)</option>
              <option value="2">2 ปัญหา (2 Problems)</option>
              <option value="3">3 ปัญหา (3 Problems)</option>
              <option value="4">4 ปัญหา (4 Problems)</option>
              <option value="5">5 ปัญหา (5 Problems)</option>
            </select>

            {/* Approval Status Filter */}
            <select
              value={selectedApprovalFilter}
              onChange={(e) => setSelectedApprovalFilter(e.target.value as 'ALL' | 'Approved' | 'Pending')}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white"
            >
              <option value="ALL">ทุกสถานะการอนุมัติ (All Status)</option>
              <option value="Approved">✓ อนุมัติแล้ว (Approved)</option>
              <option value="Pending">⏳ รออนุมัติ (Pending)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('card')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                viewMode === 'card' ? 'bg-white text-[#1e3a8a] shadow-xs' : 'text-slate-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                viewMode === 'table' ? 'bg-white text-[#1e3a8a] shadow-xs' : 'text-slate-600'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Reports Render */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">ไม่พบรายงานที่ค้นหา (No Reports Found)</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือคลิกสร้างรายงานใหม่
          </p>
          {role === 'Admin' && (
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-blue-900 transition"
            >
              + สร้างรายงานฉบับใหม่
            </button>
          )}
        </div>
      ) : viewMode === 'card' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header (Status removed as requested) */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#0f2b5c] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {report.reportNo}
                    </span>
                    {report.customer && (
                      <span className="text-[10px] font-bold text-[#1e3a8a] bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-300">
                        {report.customer}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {report.trialRound}
                    </span>
                    {report.approvalStatus === 'Approved' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenApproval(report);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition cursor-pointer"
                        title={`อนุมัติแล้ว โดย ${report.approvedBy || report.approver || '-'}`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Approved</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenApproval(report);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition cursor-pointer"
                        title="รอการอนุมัติ (คลิกเพื่อทำการ Approve ด้วยรหัสผ่าน)"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        <span>รออนุมัติ</span>
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#0f2b5c] leading-tight line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {report.jigSubAssy}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Part: <span className="font-semibold text-slate-800">{report.partName || '-'}</span> ({report.partNumber || '-'})
                </p>
              </div>

              {/* Card Body: Visual Thumbnail & Problems Pill */}
              <div className="p-4 space-y-3 flex-1">
                {/* Visual Thumbnail */}
                <div className="grid grid-cols-3 gap-1.5 h-20 bg-slate-100 rounded-lg overflow-hidden p-1 border border-slate-200">
                  <div className="col-span-2 h-full rounded overflow-hidden bg-slate-200">
                    <img
                      src={report.headerImage1}
                      alt="Header visual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="col-span-1 h-full rounded overflow-hidden bg-slate-200">
                    <img
                      src={report.problems[0]?.images[0] || report.headerImage2}
                      alt="Detail thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Problems count & Key Summary snippet */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#dc2626] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      {report.problems.length} ปัญหาที่พบ (Problems)
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      1-Page Landscape
                    </span>
                  </div>

                  {report.keyProblemsSummary && report.keyProblemsSummary.length > 0 && (
                    <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2 rounded border border-amber-200/60 line-clamp-2 leading-snug">
                      <strong className="text-[#92400e]">สรุป: </strong>
                      {report.keyProblemsSummary.join(' | ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {report.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>By: <strong className="text-slate-700">{report.creator || report.author}</strong></span>
                    {report.approver && (
                      <span className="text-slate-400">| Appr: <strong className="text-slate-700">{report.approver}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {/* 1-Page Landscape View Button */}
                <button
                  onClick={() => onViewReport(report)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition"
                  title="เปิดดูรายงานและส่งออก 1 หน้า แนวนอน (Export 1-Page Landscape)"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1-Page Landscape</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Comments Button */}
                  <button
                    onClick={() => onOpenComments(report)}
                    className="flex items-center gap-1 p-1.5 text-slate-600 hover:text-[#1e3a8a] hover:bg-white rounded border border-slate-200 transition text-xs"
                    title="แสดงความคิดเห็น (Comments)"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">{report.comments.length}</span>
                  </button>

                  {/* Admin / Management Actions */}
                  <button
                    onClick={() => onDuplicateReport(report)}
                    className="p-1.5 text-slate-600 hover:text-[#1e3a8a] hover:bg-white rounded border border-slate-200 transition cursor-pointer"
                    title="คัดลอกรายงาน (Duplicate)"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEditReport(report)}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-white rounded border border-slate-200 transition cursor-pointer"
                    title="แก้ไขรายงาน (Edit)"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteReport(report)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded border border-slate-200 transition cursor-pointer"
                    title="ลบรายงานนี้ (Delete Report)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Dense Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Report No.</th>
                  <th className="py-3 px-4">JIG Name / Part</th>
                  <th className="py-3 px-4">Round</th>
                  <th className="py-3 px-4">Approval</th>
                  <th className="py-3 px-4">Problems</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Comments</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#0f2b5c]">
                      {report.reportNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{report.jigSubAssy}</div>
                      <div className="text-[11px] text-slate-500">
                        {report.partName} ({report.partNumber})
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {report.trialRound}
                    </td>
                    <td className="py-3 px-4">
                      {report.approvalStatus === 'Approved' ? (
                        <button
                          onClick={() => onOpenApproval(report)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition cursor-pointer"
                          title={`อนุมัติแล้ว โดย ${report.approvedBy || report.approver || '-'}`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenApproval(report)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition cursor-pointer"
                          title="รออนุมัติ (คลิกเพื่อทำการ Approve)"
                        >
                          <ShieldCheck className="w-3 h-3 text-amber-700" />
                          <span>รออนุมัติ</span>
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#dc2626] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {report.problems.length} ปัญหา
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{report.date}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenComments(report)}
                        className="flex items-center gap-1 text-slate-600 hover:text-[#1e3a8a] font-semibold"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#1e3a8a]" />
                        <span>{report.comments.length}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReport(report)}
                          className="px-2.5 py-1 bg-[#1e3a8a] text-white rounded font-bold hover:bg-blue-900 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>1-Page View</span>
                        </button>
                        <button
                          onClick={() => onEditReport(report)}
                          className="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteReport(report)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
