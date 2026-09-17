import React, { useRef, useState } from 'react';
import {
  Printer,
  Download,
  FileDown,
  Share2,
  X,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileSpreadsheet,
  MessageSquare,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { TrialReport, ProblemItem, AppConfig } from '../types';

interface LandscapeReportViewProps {
  report: TrialReport;
  config: AppConfig;
  onClose: () => void;
  onOpenComments: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin: boolean;
  onOpenApproval?: () => void;
}

export const LandscapeReportView: React.FC<LandscapeReportViewProps> = ({
  report,
  config,
  onClose,
  onOpenComments,
  onEdit,
  onDelete,
  isAdmin,
  onOpenApproval
}) => {
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Maximum 5 problems allowed per report
  const displayedProblems = (report.problems || []).slice(0, 5);
  const problemCount = displayedProblems.length || 1;

  // Calculate layout strategy based on problem count (1 to 5)
  const getLayoutConfig = () => {
    switch (problemCount) {
      case 1:
        return {
          gridClass: 'grid grid-cols-1',
          cardPadding: 'p-4',
          fontSize: 'text-sm',
          headingSize: 'text-base',
          imageHeight: 'h-56',
          singleImageHeight: 'h-64',
          isSingleWide: true
        };
      case 2:
        return {
          gridClass: 'grid grid-cols-2',
          cardPadding: 'p-3.5',
          fontSize: 'text-xs sm:text-sm',
          headingSize: 'text-sm sm:text-base',
          imageHeight: 'h-48',
          singleImageHeight: 'h-56'
        };
      case 3:
        // Reference image layout! Exactly 3 columns
        return {
          gridClass: 'grid grid-cols-3',
          cardPadding: 'p-2.5',
          fontSize: 'text-xs',
          headingSize: 'text-sm',
          imageHeight: 'h-40',
          singleImageHeight: 'h-48'
        };
      case 4:
        return {
          gridClass: 'grid grid-cols-4',
          cardPadding: 'p-2',
          fontSize: 'text-[11px]',
          headingSize: 'text-xs',
          imageHeight: 'h-28 sm:h-30',
          singleImageHeight: 'h-36 sm:h-40'
        };
      case 5:
      default:
        // 5 problems: clean 5-column landscape layout
        return {
          gridClass: 'grid grid-cols-5',
          cardPadding: 'p-1.5',
          fontSize: 'text-[10px]',
          headingSize: 'text-xs',
          imageHeight: 'h-26 sm:h-28',
          singleImageHeight: 'h-32 sm:h-36'
        };
    }
  };

  const layout = getLayoutConfig();

  // Print 1-Page Landscape using native browser print
  const handlePrint = () => {
    window.print();
  };

  // Download High-Resolution PNG with exact rendered fonts and no awkward line breaking
  const handleDownloadImage = async () => {
    if (!reportContainerRef.current) return;
    setIsExportingPng(true);
    try {
      const element = reportContainerRef.current;

      // Ensure all loaded web fonts (IBM Plex Sans Thai, Plus Jakarta Sans) are ready
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Capture element using html2canvas directly with scale 2.5 for crisp clarity
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${report.reportNo}_Trial_Report_${report.partNumber || 'Export'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export PNG error:', err);
      alert('ไม่สามารถดาวน์โหลดรูปภาพได้ กรุณาลองใช้ปุ่ม Download PDF หรือ Print');
    } finally {
      setIsExportingPng(false);
    }
  };

  // Download A4 Landscape PDF with exact margins, no cut-off borders or footers
  const handleDownloadPdf = async () => {
    if (!reportContainerRef.current) return;
    setIsExportingPdf(true);
    try {
      const element = reportContainerRef.current;

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      // A4 Landscape dimensions in mm: 297 x 210
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 5; // 5mm safe margin prevents edge clipping
      const printableWidth = pageWidth - margin * 2; // 287mm
      const printableHeight = pageHeight - margin * 2; // 200mm

      const canvasRatio = canvas.width / canvas.height;
      const printableRatio = printableWidth / printableHeight;

      let renderWidth = printableWidth;
      let renderHeight = printableHeight;
      let offsetX = margin;
      let offsetY = margin;

      if (canvasRatio > printableRatio) {
        renderWidth = printableWidth;
        renderHeight = printableWidth / canvasRatio;
        offsetY = margin + (printableHeight - renderHeight) / 2;
      } else {
        renderHeight = printableHeight;
        renderWidth = printableHeight * canvasRatio;
        offsetX = margin + (printableWidth - renderWidth) / 2;
      }

      pdf.addImage(imgData, 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
      pdf.save(`${report.reportNo}_Trial_Report_${report.partNumber || 'Export'}.pdf`);
    } catch (err) {
      console.error('Export PDF error:', err);
      alert('ไม่สามารถดาวน์โหลดไฟล์ PDF ได้ กรุณาลองใช้ปุ่มพิมพ์ Print 1-Page');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status === 'Approved' ? 'Approved (อนุมัติ)' : 'Completed (เสร็จสมบูรณ์)'}
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5" />
            Under Review (กำลังตรวจสอบ)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            Draft (ร่าง)
          </span>
        );
    }
  };

  return (
    <div
      className={`landscape-modal-overlay fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-between overflow-y-auto p-2 sm:p-4 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print w-full max-w-[1400px] mb-2 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-4 shadow-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Left info & Layout Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs">
              1P
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>1-Page Landscape Export (รายงาน 1 หน้า แนวนอน)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                  {problemCount} ปัญหา (Problems)
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                สัดส่วนการจัดวางจัดสรรอัตโนมัติให้พอดี 1 หน้ากระดาษแนวนอนตามรูปต้นฉบับ
              </p>
            </div>
          </div>

          {/* Badge indicating layout structure */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-[#1e3a8a]">
            <span>1-Page Landscape ({problemCount} คอลัมน์)</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Approval Action Button */}
          {onOpenApproval && (
            report.approvalStatus === 'Approved' ? (
              <button
                onClick={onOpenApproval}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition cursor-pointer"
                title="คลิกเพื่อดูรายละเอียดการอนุมัติ หรือยกเลิกการอนุมัติ (View / Revoke Approval)"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>✓ อนุมัติแล้ว (Approved)</span>
              </button>
            ) : (
              <button
                onClick={onOpenApproval}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                title="อนุมัติรายงานนี้ (ใส่รหัสผ่านผู้อนุมัติ)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>อนุมัติรายงาน (Approve)</span>
              </button>
            )
          )}

          <button
            onClick={onOpenComments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#1e3a8a]" />
            <span>Comments ({report.comments.length})</span>
          </button>

          {isAdmin && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              <span>Edit (แก้ไข)</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition cursor-pointer"
              title="ลบรายงานนี้ (Delete Report)"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>ลบ (Delete)</span>
            </button>
          )}

          {/* Export PNG */}
          <button
            onClick={handleDownloadImage}
            disabled={isExportingPng || isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="ดาวน์โหลดเป็นภาพ PNG คมชัดสูง ตัวอักษรสวยไม่ตกบรรทัด (Download High-Res PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPng ? 'กำลังสร้าง PNG...' : 'Download PNG'}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPng || isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0f2b5c] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="บันทึกเป็นไฟล์ PDF ขนาด A4 แนวนอน พร้อมขอบครบทุกด้าน ไม่ตกขอบ (Download A4 Landscape PDF)"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isExportingPdf ? 'กำลังสร้าง PDF...' : 'Download PDF'}</span>
          </button>

          {/* Print 1-Page */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="พิมพ์ หรือ บันทึกเป็น PDF แนวนอน 1 หน้า (Print 1-Page Landscape)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print 1-Page</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title={isFullscreen ? 'ย่อขนาด (Exit Fullscreen)' : 'เต็มจอ (Fullscreen)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="ปิดหน้าต่าง (Close)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Landscape 1-Page Document Container */}
      {/* Formatted in standard 16:9 / A4 landscape aspect ratio with exact border framing from the image */}
      <div className="print-page-landscape-wrapper w-full flex justify-center items-center flex-1 my-auto overflow-auto py-2">
        <div
          ref={reportContainerRef}
          id={`trial-report-page-${report.id}`}
          className="print-page-landscape bg-white text-slate-900 border-2 border-slate-900 shadow-2xl w-full max-w-[1360px] aspect-[1.55/1] flex flex-col justify-between overflow-hidden select-text"
          style={{
            minHeight: '620px',
            maxHeight: '94vh'
          }}
        >
          {/* 1. Header Bar: Title */}
          <div className="border-b-2 border-slate-900 py-1.5 px-4 bg-white flex items-center justify-between shrink-0">
            <div className="w-1/4 flex items-center gap-2">
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt="Company Logo"
                  className="h-7 w-auto object-contain max-w-[90px]"
                />
              )}
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">
                {report.line || 'Production Jig Assembly'}
              </span>
            </div>

            {/* Central Document Title - Exactly matching the image */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2b5c] tracking-normal text-center flex-1 whitespace-nowrap">
              Trial Report
            </h1>

            <div className="w-1/4 flex items-center justify-end gap-2 text-right whitespace-nowrap">
              {report.customer && (
                <span className="text-xs font-bold text-[#1e3a8a] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 whitespace-nowrap">
                  {report.customer}
                </span>
              )}
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300 whitespace-nowrap shrink-0">
                {report.trialRound || 'Trial #1'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap shrink-0">
                {report.date}
              </span>
            </div>
          </div>

          {/* 2. Top Section: 3 Columns (Header Image 1, Header Image 2, Summary Box) */}
          <div className="grid grid-cols-12 border-b-2 border-slate-900 bg-white min-h-[170px] max-h-[220px] shrink-0">
            {/* Left Box: Header Image 1 + JIG Caption */}
            <div className="col-span-5 border-r-2 border-slate-900 p-2 flex items-center gap-3">
              <div className="w-1/2 h-full max-h-[180px] rounded border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                {report.headerImage1 ? (
                  <img
                    src={report.headerImage1}
                    alt="JIG Overview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Jig Overview Image</span>
                )}
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                <div className="text-sm sm:text-base font-bold text-[#0f2b5c] leading-snug mb-1">
                  {report.jigSubAssy || 'JIG :'}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Part: <span className="font-semibold text-slate-900">{report.partName || '-'}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  P/No: {report.partNumber || '-'}
                </div>
                <div className="text-[10px] text-slate-600 mt-1 flex flex-col gap-0.5 pt-1 border-t border-slate-200">
                  <div className="whitespace-nowrap">Customer: <strong className="text-[#1e3a8a]">{report.customer || '-'}</strong></div>
                  <div className="whitespace-nowrap">Creator: <strong className="text-slate-800">{report.creator || report.author || '-'}</strong></div>
                </div>
              </div>
            </div>

            {/* Middle Box: Header Image 2 (Secondary focus / hand holding workpiece) */}
            <div className="col-span-3 border-r-2 border-slate-900 p-2 flex flex-col items-center justify-center">
              <div className="w-full h-full max-h-[180px] rounded border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                {report.headerImage2 ? (
                  <img
                    src={report.headerImage2}
                    alt="Detail Focus"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Detail Photo</span>
                )}
              </div>
              {report.headerImage2Caption && (
                <span className="text-[10px] text-slate-500 mt-0.5 truncate w-full text-center">
                  {report.headerImage2Caption}
                </span>
              )}
            </div>

            {/* Right Box: สรุป ปัญหาหลัก (Key Problems Summary - Exact Style from Reference) */}
            <div className="col-span-4 p-2.5 flex flex-col justify-center bg-slate-50/40">
              <div className="text-xs sm:text-sm font-bold text-[#92400e] mb-1.5 flex items-center gap-1.5 whitespace-nowrap">
                <span className="whitespace-nowrap">สรุป ปัญหาหลัก</span>
                <span className="text-[10px] text-slate-500 font-normal whitespace-nowrap">(Key Problems Summary)</span>
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[160px] pr-1">
                {report.keyProblemsSummary && report.keyProblemsSummary.length > 0 ? (
                  report.keyProblemsSummary.map((summaryText, idx) => (
                    <div
                      key={idx}
                      className="text-xs sm:text-[13px] font-bold text-[#0f2b5c] leading-normal"
                    >
                      {summaryText}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">ไม่มีรายการสรุปปัญหาหลัก</div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Problems & Countermeasures Section (1 to 5 Problems Landscape Grid) */}
          {/* Custom Layout: Divided with vertical border lines exactly as shown in the reference image */}
          <div
            className={`flex-1 ${layout.gridClass} divide-x-2 divide-slate-900 bg-white min-h-[300px] overflow-hidden`}
          >
            {displayedProblems.map((problem, idx) => {
              const imageCount = problem.images ? problem.images.length : 0;
              const imgHeight = imageCount === 1 ? layout.singleImageHeight : layout.imageHeight;

              return (
                <div
                  key={problem.id}
                  className={`flex flex-col justify-start ${layout.cardPadding} bg-white overflow-hidden`}
                >
                  {/* Top content of Problem card */}
                  <div className="space-y-1.5">
                    {/* Red Problem Title: 1. ปัญหาที่พบ */}
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`${layout.headingSize} font-bold text-[#dc2626] leading-normal whitespace-nowrap`}>
                          {problem.orderNumber || idx + 1}. ปัญหาที่พบ
                        </span>
                        {problem.severity === 'High' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded border border-red-200 whitespace-nowrap shrink-0">
                            Urgent
                          </span>
                        )}
                      </div>
                      {/* Problem Description with bullets */}
                      <div className={`${layout.fontSize} text-[#0f2b5c] font-semibold whitespace-pre-line leading-relaxed`}>
                        {problem.description}
                      </div>
                    </div>

                    {/* Green Countermeasure Title: แก้ไข */}
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`${layout.headingSize} font-bold text-[#15803d] leading-normal whitespace-nowrap`}>
                          แก้ไข
                        </span>
                        {problem.status === 'Solved' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300 whitespace-nowrap shrink-0">
                            Done
                          </span>
                        )}
                      </div>
                      {/* Countermeasure Description with bullets */}
                      <div className={`${layout.fontSize} text-[#0f2b5c] font-semibold whitespace-pre-line leading-relaxed`}>
                        {problem.countermeasure}
                      </div>
                    </div>
                  </div>

                  {/* Problem Images: Attached directly below countermeasure section (top-aligned, near content) */}
                  <div className="mt-1.5 pt-1 border-t border-slate-200 flex flex-col justify-start">
                    {imageCount > 0 ? (
                      <div
                        className={`grid gap-1.5 ${
                          imageCount > 1 && problemCount <= 3
                            ? 'grid-cols-2'
                            : 'grid-cols-1'
                        } items-start justify-items-center w-full`}
                      >
                        {problem.images.slice(0, 2).map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className={`w-full ${imgHeight} rounded border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Problem ${idx + 1} Illustration ${imgIdx + 1}`}
                              className="w-full h-full object-contain p-0.5"
                            />
                            {problem.imageCaptions && problem.imageCaptions[imgIdx] && (
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                                {problem.imageCaptions[imgIdx]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`w-full ${imgHeight} rounded border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400`}>
                        ไม่มีรูปภาพประกอบ
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Document Footer Bar */}
          <div className="border-t-2 border-slate-900 bg-slate-50 px-4 py-1.5 text-[10px] text-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 font-medium flex-wrap">
              <span className="whitespace-nowrap">Report No: <strong className="text-slate-900">{report.reportNo}</strong></span>
              <span className="whitespace-nowrap">Creator / ผู้จัดทำ: <strong className="text-slate-900">{report.creator || report.author}</strong></span>
              <span className="whitespace-nowrap flex items-center gap-1">
                Approver / ผู้อนุมัติ: <strong className="text-slate-900">{report.approver || '-'}</strong>
                {report.approvalStatus === 'Approved' ? (
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                    <span>✓ APPROVED</span>
                    {report.approvedDate && <span className="font-mono text-emerald-700 font-normal">({report.approvedDate})</span>}
                  </span>
                ) : (
                  <span className="text-[9px] text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                    ⏳ PENDING (รออนุมัติ)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="whitespace-nowrap">Customer: <strong className="text-[#1e3a8a]">{report.customer || '-'}</strong></span>
              <span className="font-semibold text-slate-800 whitespace-nowrap">
                Official Trial Document • {config.companyName || 'Trial Report System'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
