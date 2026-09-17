import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  BookOpen,
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { TrialReport, ProblemItem, AppConfig, ProblemSeverity, ProblemStatus } from '../types';

interface FlattenedProblem {
  problem: ProblemItem;
  reportId: string;
  reportNo: string;
  jigSubAssy: string;
  partName: string;
  partNumber: string;
  date: string;
  customer: string;
  creator: string;
  approver: string;
  trialRound: string;
  originalReport: TrialReport;
}

interface ProblemBaseProps {
  reports: TrialReport[];
  onViewReport: (report: TrialReport) => void;
  config: AppConfig;
}

export const ProblemBase: React.FC<ProblemBaseProps> = ({
  reports,
  onViewReport,
  config
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('ALL');
  const [selectedCreator, setSelectedCreator] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Flatten all problems from all reports
  const allProblems: FlattenedProblem[] = useMemo(() => {
    const list: FlattenedProblem[] = [];
    reports.forEach((rep) => {
      const cust = rep.customer || 'ทั่วไป (General)';
      const crt = rep.creator || rep.author || 'ไม่ระบุ';
      const appr = rep.approver || '-';

      (rep.problems || []).forEach((prob) => {
        list.push({
          problem: prob,
          reportId: rep.id,
          reportNo: rep.reportNo,
          jigSubAssy: rep.jigSubAssy,
          partName: rep.partName,
          partNumber: rep.partNumber,
          date: rep.date,
          customer: cust,
          creator: crt,
          approver: appr,
          trialRound: rep.trialRound,
          originalReport: rep
        });
      });
    });
    return list;
  }, [reports]);

  // Unique customers and creators for filter dropdowns
  const customerOptions = useMemo(() => {
    const set = new Set<string>();
    // From config
    if (config.customers) {
      config.customers.forEach((c) => set.add(c));
    }
    // From actual reports
    allProblems.forEach((p) => {
      if (p.customer) set.add(p.customer);
    });
    return Array.from(set).sort();
  }, [config.customers, allProblems]);

  const creatorOptions = useMemo(() => {
    const set = new Set<string>();
    if (config.creators) {
      config.creators.forEach((c) => set.add(c));
    }
    allProblems.forEach((p) => {
      if (p.creator) set.add(p.creator);
    });
    return Array.from(set).sort();
  }, [config.creators, allProblems]);

  // Filter logic
  const filteredProblems = useMemo(() => {
    return allProblems.filter((item) => {
      // 1. Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          item.problem.title.toLowerCase().includes(query) ||
          item.problem.description.toLowerCase().includes(query) ||
          item.problem.countermeasure.toLowerCase().includes(query) ||
          item.jigSubAssy.toLowerCase().includes(query) ||
          item.partName.toLowerCase().includes(query) ||
          item.partNumber.toLowerCase().includes(query) ||
          item.reportNo.toLowerCase().includes(query) ||
          item.customer.toLowerCase().includes(query) ||
          item.creator.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // 2. Filter by Customer
      if (selectedCustomer !== 'ALL') {
        if (item.customer !== selectedCustomer) return false;
      }

      // 3. Filter by Creator
      if (selectedCreator !== 'ALL') {
        if (item.creator !== selectedCreator) return false;
      }

      // 4. Filter by Date (Match date prefix or exact date)
      if (selectedDate) {
        if (!item.date.startsWith(selectedDate)) return false;
      }

      // 5. Filter by Severity
      if (selectedSeverity !== 'ALL') {
        if (item.problem.severity !== selectedSeverity) return false;
      }

      // 6. Filter by Status
      if (selectedStatus !== 'ALL') {
        if (item.problem.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [
    allProblems,
    searchTerm,
    selectedCustomer,
    selectedCreator,
    selectedDate,
    selectedSeverity,
    selectedStatus
  ]);

  // Copy countermeasure helper
  const handleCopySolution = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCustomer('ALL');
    setSelectedCreator('ALL');
    setSelectedDate('');
    setSelectedSeverity('ALL');
    setSelectedStatus('ALL');
  };

  const isFilteringActive =
    searchTerm !== '' ||
    selectedCustomer !== 'ALL' ||
    selectedCreator !== 'ALL' ||
    selectedDate !== '' ||
    selectedSeverity !== 'ALL' ||
    selectedStatus !== 'ALL';

  // Statistics
  const totalCount = allProblems.length;
  const solvedCount = allProblems.filter((p) => p.problem.status === 'Solved').length;
  const solvedRate = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-100 text-[#1e3a8a]">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0f2b5c] tracking-tight">
                Problem Base (คลังปัญหาและแนวทางแก้ไข)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              ฐานข้อมูลค้นหาปัญหาที่เคยเกิดขึ้นในอดีต พร้อมแนวทางแก้ไขและมาตรการตอบโต้ (Countermeasure) 
              เพื่อใช้เป็นแนวทางอ้างอิงเมื่อเจอปัญหาที่คล้ายคลึงกันในอนาคต
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
              <div className="text-[11px] text-slate-500 font-medium">ปัญหาทั้งหมด</div>
              <div className="text-lg font-black text-[#0f2b5c]">{totalCount} รายการ</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center">
              <div className="text-[11px] text-emerald-700 font-medium">แก้ไขสำเร็จแล้ว</div>
              <div className="text-lg font-black text-emerald-800">{solvedRate}% ({solvedCount})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Panel (Customer, Creator, Date, Severity, Status) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาปัญหา เช่น ไม่ได้ระยะ 3 mm, สลัก Pin หลวม, ชิ้นงานหลุด, รอยเชื่อมแต้ม, ชื่อ JIG, ชื่อชิ้นงาน..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-0.5 rounded cursor-pointer"
            >
              ล้าง
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          {/* 1. Filter by Customer */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span>Customer (ลูกค้า)</span>
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="ALL">ลูกค้าทั้งหมด (All Customers)</option>
              {customerOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 2. Filter by Creator */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span>Creator (ผู้จัดทำ)</span>
            </label>
            <select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="ALL">ผู้จัดทำทั้งหมด (All Creators)</option>
              {creatorOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 3. Filter by Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span>Date (วันที่ทดสอบ)</span>
            </label>
            <div className="flex gap-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#1e3a8a]"
              />
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className="px-2 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 rounded cursor-pointer"
                  title="ล้างวันที่"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 4. Filter by Severity */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Severity (ความรุนแรง)</span>
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="ALL">ทุกระดับความรุนแรง</option>
              <option value="High">High (รุนแรงสูง / กระทบชิ้นงาน)</option>
              <option value="Medium">Medium (ปานกลาง)</option>
              <option value="Low">Low (เล็กน้อย)</option>
            </select>
          </div>

          {/* 5. Filter by Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status (สถานะ)</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="ALL">ทุกสถานะปัญหา</option>
              <option value="Solved">Solved (แก้ไขเรียบร้อยแล้ว)</option>
              <option value="In Progress">In Progress (กำลังดำเนินการ)</option>
              <option value="Pending">Pending (รอดำเนินการ)</option>
            </select>
          </div>
        </div>

        {/* Filter Stats & Reset */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <div>
            พบปัญหาที่ตรงกับเงื่อนไข: <strong className="text-slate-900 font-bold">{filteredProblems.length}</strong> จากทั้งหมด {allProblems.length} รายการ
          </div>
          {isFilteringActive && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-[#1e3a8a] hover:underline font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตตัวกรองทั้งหมด (Reset Filters)</span>
            </button>
          )}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-4">
        {filteredProblems.map((item, idx) => {
          const p = item.problem;
          const isCopied = copiedId === p.id;

          return (
            <div
              key={`${item.reportId}-${p.id}-${idx}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 overflow-hidden"
            >
              {/* Card Header: Context Tags & Actions */}
              <div className="bg-slate-50/90 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1e3a8a] text-white">
                    {item.reportNo}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1e3a8a] border border-blue-200 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{item.customer}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                    {item.trialRound}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.status === 'Solved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : p.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {p.status === 'Solved' && <CheckCircle2 className="w-3 h-3" />}
                    {p.status === 'In Progress' && <Clock className="w-3 h-3" />}
                    {p.status === 'Pending' && <AlertTriangle className="w-3 h-3" />}
                    <span>{p.status}</span>
                  </span>

                  {/* Severity */}
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      p.severity === 'High'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : p.severity === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {p.severity}
                  </span>

                  {/* Open full report */}
                  <button
                    onClick={() => onViewReport(item.originalReport)}
                    className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                    title="เปิดดูรายงานฉบับเต็ม (View 1-Page Landscape Report)"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#1e3a8a]" />
                    <span className="hidden sm:inline">ดูรายงาน 1 หน้า</span>
                  </button>
                </div>
              </div>

              {/* JIG & Part Header Info */}
              <div className="px-4 sm:px-6 pt-3 pb-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 border-b border-slate-100">
                <div>
                  <strong className="text-[#0f2b5c] font-bold">{item.jigSubAssy}</strong>
                </div>
                <div>
                  Part: <strong className="text-slate-800">{item.partName || '-'}</strong> ({item.partNumber || '-'})
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>ผู้จัดทำ: <strong className="text-slate-700">{item.creator}</strong></span>
                  {item.approver && item.approver !== '-' && (
                    <span className="text-[11px] text-slate-400 pl-1 border-l border-slate-200">
                      ผู้อนุมัติ: {item.approver}
                    </span>
                  )}
                </div>
              </div>

              {/* Problem & Countermeasure Split View */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: ปัญหาที่พบ (Problem Description) */}
                <div className="lg:col-span-6 bg-red-50/40 rounded-xl p-4 border border-red-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wide mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{p.title || 'ปัญหาที่พบ (Problem Description)'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                      {p.description || '-'}
                    </p>
                  </div>

                  {/* Problem Photo (if available) */}
                  {p.images && p.images[0] && (
                    <div className="mt-3 pt-3 border-t border-red-200/60">
                      <div className="w-full h-36 sm:h-44 rounded-lg bg-white border border-red-200 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={p.images[0]}
                          alt={p.imageCaptions?.[0] || 'ภาพปัญหา'}
                          className="w-full h-full object-contain p-1"
                        />
                        {p.imageCaptions && p.imageCaptions[0] && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate text-center">
                            {p.imageCaptions[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: มาตรการแก้ไข / แนวทางป้องกัน (Countermeasure) */}
                <div className="lg:col-span-6 bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>แนวทางแก้ไข / มาตรการตอบโต้ (Countermeasure)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopySolution(p.countermeasure, p.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                        title="คัดลอกแนวทางแก้ไขนี้ไปใช้ในรายงานฉบับใหม่"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>คัดลอกแล้ว!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>คัดลอกแนวทาง</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-semibold">
                      {p.countermeasure || '-'}
                    </p>
                  </div>

                  {/* Solution Photo (Image 2 if available, or image 1 if only 1 image exists) */}
                  {p.images && p.images.length > 1 ? (
                    <div className="mt-3 pt-3 border-t border-emerald-200">
                      <div className="w-full h-36 sm:h-44 rounded-lg bg-white border border-emerald-200 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={p.images[1]}
                          alt={p.imageCaptions?.[1] || 'ภาพแนวทางแก้ไข'}
                          className="w-full h-full object-contain p-1"
                        />
                        {p.imageCaptions && p.imageCaptions[1] && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate text-center">
                            {p.imageCaptions[1]}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : p.images && p.images[0] ? (
                    <div className="mt-3 text-[11px] text-slate-400 italic">
                      * รูปภาพปัญหาและแนวทางแก้ไขอยู่ในชุดภาพเดียวกัน (ดูภาพฝั่งซ้าย)
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              ไม่พบปัญหาที่ตรงกับเงื่อนไขการค้นหา
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรอง Customer, Creator หรือวันที่ เพื่อแสดงรายการปัญหาทั้งหมด
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition cursor-pointer"
            >
              รีเซ็ตตัวกรองทั้งหมด (Reset Filters)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
