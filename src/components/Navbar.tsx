import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  User,
  Image as ImageIcon,
  ChevronDown,
  Menu,
  Check,
  BookOpen,
  Settings2
} from 'lucide-react';
import { UserRole, AppConfig } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'reports' | 'problem-base' | 'create';
  onSelectTab: (tab: 'dashboard' | 'reports' | 'problem-base' | 'create') => void;
  role: UserRole;
  onRequestAdmin: () => void;
  onSwitchToUser: () => void;
  config: AppConfig;
  onOpenProfileModal: () => void;
  onOpenMasterData: () => void;
  totalReportsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  role,
  onRequestAdmin,
  onSwitchToUser,
  config,
  onOpenProfileModal,
  onOpenMasterData,
  totalReportsCount
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Labels and icons for currently active tab
  const getActiveTabInfo = () => {
    switch (currentTab) {
      case 'dashboard':
        return { label: 'Dashboard (แดชบอร์ด)', icon: LayoutDashboard };
      case 'reports':
        return { label: `Report List (รายงาน ${totalReportsCount})`, icon: FileText };
      case 'problem-base':
        return { label: 'Problem Base (คลังปัญหา)', icon: BookOpen };
      case 'create':
        return { label: 'Create Report (สร้างรายงาน)', icon: PlusCircle };
      default:
        return { label: 'เลือกฟังก์ชัน (Menu)', icon: Menu };
    }
  };

  const activeTabInfo = getActiveTabInfo();
  const ActiveIcon = activeTabInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand / Profile Icon (Bigger Web Icon & Single-line Title) */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* 1. Bigger Icon Web */}
            <button
              onClick={onOpenProfileModal}
              title="คลิกเพื่อเปลี่ยนรูป Profile หรือ Icon เว็บ (Click to change web icon)"
              className="relative group flex items-center text-left focus:outline-none cursor-pointer"
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#0f2b5c] border-2 border-blue-900/40 shadow-sm flex items-center justify-center overflow-hidden transition group-hover:ring-2 group-hover:ring-[#1e3a8a] group-hover:scale-105 shrink-0">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1e3a8a] flex flex-col items-center justify-center text-white">
                    <span className="font-black text-base tracking-tighter">TR</span>
                    <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest -mt-0.5">PRO</span>
                  </div>
                )}
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </button>

            {/* 2. Trial Report in a single line without wrapping */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-black text-[#0f2b5c] tracking-tight whitespace-nowrap">
                  Trial Report
                </span>
                <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full whitespace-nowrap">
                  Official
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs whitespace-nowrap">
                {config.companyName || 'ระบบจัดการและสร้างรายงานการทดสอบ'}
              </p>
            </div>
          </div>

          {/* Center / Actions: Consolidated Dropdown Menu for Functions & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* 3. Dropdown Menu for Dashboard, Report List, Create Report, and Icon Web */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer shadow-xs ${
                  isDropdownOpen
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-[#1e3a8a] hover:bg-slate-50'
                }`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <ActiveIcon className={`w-4 h-4 ${isDropdownOpen ? 'text-white' : 'text-[#1e3a8a]'}`} />
                <span className="whitespace-nowrap font-bold">
                  {activeTabInfo.label}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-white' : 'text-slate-500'
                  }`}
                />
              </button>

              {/* Dropdown Popover */}
              {isDropdownOpen && (
                <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    เลือกฟังก์ชันการทำงาน (Menu)
                  </div>

                  {/* 1. Dashboard */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('dashboard');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition cursor-pointer ${
                      currentTab === 'dashboard'
                        ? 'bg-blue-50/80 text-[#1e3a8a] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${currentTab === 'dashboard' ? 'bg-[#1e3a8a] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Dashboard (แดชบอร์ด)</div>
                        <div className="text-[10px] text-slate-400">สรุปภาพรวมสถิติและสถานะ</div>
                      </div>
                    </div>
                    {currentTab === 'dashboard' && <Check className="w-4 h-4 text-[#1e3a8a]" />}
                  </button>

                  {/* 2. Report List */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('reports');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition cursor-pointer ${
                      currentTab === 'reports'
                        ? 'bg-blue-50/80 text-[#1e3a8a] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${currentTab === 'reports' ? 'bg-[#1e3a8a] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>Report List (รายการรายงาน)</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                            {totalReportsCount}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">ค้นหา ตรวจสอบ และพิมพ์รายงาน</div>
                      </div>
                    </div>
                    {currentTab === 'reports' && <Check className="w-4 h-4 text-[#1e3a8a]" />}
                  </button>

                  {/* 3. Problem Base (New Menu!) */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('problem-base');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition cursor-pointer ${
                      currentTab === 'problem-base'
                        ? 'bg-blue-50/80 text-[#1e3a8a] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${currentTab === 'problem-base' ? 'bg-[#1e3a8a] text-white' : 'bg-amber-100 text-amber-800'}`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Problem Base (คลังปัญหา)</div>
                        <div className="text-[10px] text-slate-400">ค้นหาปัญหา ค้น Customer/Creator/Date</div>
                      </div>
                    </div>
                    {currentTab === 'problem-base' && <Check className="w-4 h-4 text-[#1e3a8a]" />}
                  </button>

                  {/* 4. Create Report */}
                  <button
                    type="button"
                    onClick={() => {
                      if (role !== 'Admin') {
                        onRequestAdmin();
                      } else {
                        onSelectTab('create');
                      }
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition cursor-pointer ${
                      currentTab === 'create'
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${currentTab === 'create' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5 text-emerald-700">
                          <span>+ Create Report (สร้างรายงาน)</span>
                          {role !== 'Admin' && (
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-normal">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {role === 'Admin' ? 'สร้างเอกสารรายงานใหม่' : 'ต้องใส่รหัสผ่านเพื่อเข้าใช้งาน'}
                        </div>
                      </div>
                    </div>
                    {currentTab === 'create' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <div className="my-1.5 border-t border-slate-100" />

                  {/* 5. Master Data (Customer, Creator, Approver Options) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (role !== 'Admin') {
                        onRequestAdmin();
                      } else {
                        onOpenMasterData();
                      }
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left text-slate-700 hover:bg-slate-100 transition cursor-pointer font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                        <Settings2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span>จัดการตัวเลือก (Master Data)</span>
                          {role !== 'Admin' && (
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-normal">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">กำหนด Customer, Creator, Approver</div>
                      </div>
                    </div>
                  </button>

                  {/* 6. Icon Web / Profile Modal */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProfileModal();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left text-slate-700 hover:bg-slate-100 transition cursor-pointer font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-[#1e3a8a]">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Icon Web (โลโก้ / ข้อมูล)</div>
                        <div className="text-[10px] text-slate-400">เปลี่ยนรูปไอคอนเว็บและชื่อบริษัท</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Role Toggle Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => {
                  if (role !== 'User') onSwitchToUser();
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  role === 'User'
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="โหมด User: ดูข้อมูล Dashboard และแสดงความคิดเห็น Comment ในรายงานได้"
              >
                <User className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline">User (ผู้ใช้)</span>
                <span className="sm:hidden">User</span>
              </button>

              <button
                onClick={() => {
                  if (role !== 'Admin') onRequestAdmin();
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  role === 'Admin'
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'text-slate-500 hover:text-[#1e3a8a]'
                }`}
                title="โหมด Admin: ต้องกรอกรหัสผ่านเพื่อเข้าใช้งาน"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Admin (ผู้ดูแล)</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
