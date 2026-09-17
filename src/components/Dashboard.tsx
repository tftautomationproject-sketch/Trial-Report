import React from 'react';
import {
  BarChart3,
  PieChart,
  FileCheck2,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
  Eye,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { TrialReport } from '../types';

interface DashboardProps {
  reports: TrialReport[];
  onViewReport: (report: TrialReport) => void;
  onNavigateToReports: () => void;
  onOpenApproval?: (report: TrialReport) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  reports,
  onViewReport,
  onNavigateToReports,
  onOpenApproval
}) => {
  // Aggregate KPIs
  const totalReports = reports.length;
  const approvedReportsCount = reports.filter((r) => r.approvalStatus === 'Approved').length;
  const pendingReportsCount = reports.filter((r) => r.approvalStatus !== 'Approved').length;

  let totalProblems = 0;
  let solvedProblems = 0;
  let pendingProblems = 0;
  let inProgressProblems = 0;
  let highSeverityCount = 0;

  reports.forEach((r) => {
    r.problems.forEach((p) => {
      totalProblems++;
      if (p.status === 'Solved') solvedProblems++;
      else if (p.status === 'In Progress') inProgressProblems++;
      else pendingProblems++;

      if (p.severity === 'High') highSeverityCount++;
    });
  });

  const solutionRate =
    totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  // Status breakdown
  const statusCounts = {
    Approved: reports.filter((r) => r.status === 'Approved').length,
    Completed: reports.filter((r) => r.status === 'Completed').length,
    'Under Review': reports.filter((r) => r.status === 'Under Review').length,
    Draft: reports.filter((r) => r.status === 'Draft').length
  };

  // Problems count per report distribution (1 to 5)
  const problemCountDistribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  reports.forEach((r) => {
    const count = Math.min(Math.max(r.problems.length, 1), 5);
    problemCountDistribution[count] = (problemCountDistribution[count] || 0) + 1;
  });

  // Breakdown by Line
  const lineCounts: Record<string, number> = {};
  reports.forEach((r) => {
    const l = r.line || 'General Line';
    lineCounts[l] = (lineCounts[l] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2b5c] flex items-center gap-2">
            <span>Dashboard (แดชบอร์ดสรุปผลรายงานการทดสอบ)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            สรุปภาพรวมสถิติรายงาน ปัญหาที่พบ (Problems 1-5 รายการ) และอัตราการแก้ไข (Countermeasure Rate)
          </p>
        </div>

        <button
          onClick={onNavigateToReports}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition"
        >
          <span>ดูรายการรายงานทั้งหมด ({totalReports})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Row (75% white / 20% blue / 5% emerald green) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Report (รายงานทั้งหมด)
            </span>
            <div className="text-3xl font-extrabold text-[#0f2b5c] mt-1">
              {totalReports}
            </div>
            <span className="text-[11px] text-slate-400">ฉบับในระบบ</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1e3a8a]">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Problems */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Problems (ปัญหาที่พบทั้งหมด)
            </span>
            <div className="text-3xl font-extrabold text-[#dc2626] mt-1">
              {totalProblems}
            </div>
            <span className="text-[11px] text-red-500 font-semibold">
              ด่วนมาก {highSeverityCount} รายการ
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#dc2626]">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Countermeasure Solved Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Solved Rate (แก้ไขเสร็จสิ้น)
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              {solutionRate}%
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">
              {solvedProblems} จาก {totalProblems} ปัญหา
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Countermeasures */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              In Progress / Pending (กำลังดำเนินการ)
            </span>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">
              {pendingProblems + inProgressProblems}
            </div>
            <span className="text-[11px] text-slate-400">
              รอติดตามใน Trial ถัดไป
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Distribution of Problems per Report (1 to 6 Problems Custom Grid Analysis) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0f2b5c] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1e3a8a]" />
                <span>Problems per Report Distribution (จำนวนปัญหาต่อรายงาน 1-5 รายการ)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                สถิติการจัดสรรหน้าแนวนอนตามจำนวนปัญหาที่พบในแต่ละ Trial (สูงสุด 5 ปัญหาต่อรายงาน)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              1-Page Landscape
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((num) => {
              const count = problemCountDistribution[num] || 0;
              const pct = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;
              return (
                <div key={num} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {num} ปัญหา ({num} Problem{num > 1 ? 's' : ''})
                      {num === 3 && (
                        <span className="ml-1.5 text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          Template ในรูป
                        </span>
                      )}
                    </span>
                    <span className="font-mono font-bold text-[#0f2b5c]">
                      {count} รายงาน ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        num === 3
                          ? 'bg-[#1e3a8a]'
                          : num <= 2
                          ? 'bg-emerald-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Status Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0f2b5c] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#1e3a8a]" />
              <span>Report Status (สถานะรายงานทั้งหมด)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              สัดส่วนสถานะการตรวจสอบและอนุมัติ
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Approval KPIs */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">Approved (อนุมัติแล้ว)</div>
                  <div className="text-[10px] text-emerald-700">ผ่านการอนุมัติด้วยรหัสผ่าน</div>
                </div>
              </div>
              <span className="text-sm font-mono font-extrabold text-emerald-800">
                {approvedReportsCount}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-amber-950">Pending (รออนุมัติ)</div>
                  <div className="text-[10px] text-amber-700">รอผู้มีอำนาจกดอนุมัติ</div>
                </div>
              </div>
              <span className="text-sm font-mono font-extrabold text-amber-800">
                {pendingReportsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trial Reports Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#0f2b5c]">
              Recent Trial Reports (รายงานการทดสอบล่าสุด)
            </h3>
            <p className="text-[11px] text-slate-500">
              คลิกเพื่อเปิดดูแบบ 1-Page Landscape ทันที
            </p>
          </div>
          <button
            onClick={onNavigateToReports}
            className="text-xs text-[#1e3a8a] hover:underline font-semibold"
          >
            ดูทั้งหมด ({totalReports}) &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Report No.</th>
                <th className="py-2.5 px-3">JIG Name</th>
                <th className="py-2.5 px-3">Approval</th>
                <th className="py-2.5 px-3">Problems</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">View Landscape</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.slice(0, 4).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-[#0f2b5c]">
                    {r.reportNo}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    <div>{r.jigSubAssy}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{r.partName}</div>
                  </td>
                  <td className="py-3 px-3">
                    {r.approvalStatus === 'Approved' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        <span>รออนุมัติ</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#dc2626] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {r.problems.length} ปัญหา
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {r.date}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onViewReport(r)}
                      className="px-3 py-1 bg-[#1e3a8a] text-white rounded font-bold hover:bg-blue-900 transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>1-Page</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
