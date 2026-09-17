import React, { useState } from 'react';
import { X, Plus, Trash2, Users, UserCheck, Building2, Check, RotateCcw } from 'lucide-react';
import { AppConfig } from '../types';
import { DEFAULT_APP_CONFIG } from '../mockData';

interface MasterDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (updatedConfig: AppConfig) => void;
}

type TabType = 'customers' | 'creators' | 'approvers';

export const MasterDataModal: React.FC<MasterDataModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  
  const [customers, setCustomers] = useState<string[]>(
    config.customers && config.customers.length > 0 ? config.customers : DEFAULT_APP_CONFIG.customers || []
  );
  const [creators, setCreators] = useState<string[]>(
    config.creators && config.creators.length > 0 ? config.creators : DEFAULT_APP_CONFIG.creators || []
  );
  const [approvers, setApprovers] = useState<string[]>(
    config.approvers && config.approvers.length > 0 ? config.approvers : DEFAULT_APP_CONFIG.approvers || []
  );

  const [newCustomer, setNewCustomer] = useState('');
  const [newCreator, setNewCreator] = useState('');
  const [newApprover, setNewApprover] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Add items
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim()) return;
    if (customers.includes(newCustomer.trim())) {
      alert('มีชื่อลูกค้านี้ในระบบแล้ว');
      return;
    }
    const updated = [...customers, newCustomer.trim()];
    setCustomers(updated);
    setNewCustomer('');
    saveChanges({ customers: updated });
  };

  const handleAddCreator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreator.trim()) return;
    if (creators.includes(newCreator.trim())) {
      alert('มีชื่อผู้จัดทำนี้ในระบบแล้ว');
      return;
    }
    const updated = [...creators, newCreator.trim()];
    setCreators(updated);
    setNewCreator('');
    saveChanges({ creators: updated });
  };

  const handleAddApprover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApprover.trim()) return;
    if (approvers.includes(newApprover.trim())) {
      alert('มีชื่อผู้อนุมัตินี้ในระบบแล้ว');
      return;
    }
    const updated = [...approvers, newApprover.trim()];
    setApprovers(updated);
    setNewApprover('');
    saveChanges({ approvers: updated });
  };

  // Remove items
  const handleRemoveCustomer = (index: number) => {
    const updated = customers.filter((_, i) => i !== index);
    setCustomers(updated);
    saveChanges({ customers: updated });
  };

  const handleRemoveCreator = (index: number) => {
    const updated = creators.filter((_, i) => i !== index);
    setCreators(updated);
    saveChanges({ creators: updated });
  };

  const handleRemoveApprover = (index: number) => {
    const updated = approvers.filter((_, i) => i !== index);
    setApprovers(updated);
    saveChanges({ approvers: updated });
  };

  // Save to parent and Firestore
  const saveChanges = (partial: Partial<AppConfig>) => {
    const updated: AppConfig = {
      ...config,
      customers: partial.customers !== undefined ? partial.customers : customers,
      creators: partial.creators !== undefined ? partial.creators : creators,
      approvers: partial.approvers !== undefined ? partial.approvers : approvers
    };
    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (confirm('คุณต้องการรีเซ็ตรายชื่อตัวเลือกเป็นค่าเริ่มต้นหรือไม่?')) {
      const defaultCust = DEFAULT_APP_CONFIG.customers || [];
      const defaultCreat = DEFAULT_APP_CONFIG.creators || [];
      const defaultAppr = DEFAULT_APP_CONFIG.approvers || [];
      setCustomers(defaultCust);
      setCreators(defaultCreat);
      setApprovers(defaultAppr);
      saveChanges({
        customers: defaultCust,
        creators: defaultCreat,
        approvers: defaultAppr
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-[#0f2b5c] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1e3a8a]" />
              <span>จัดการข้อมูลหลักตัวเลือก (Master Data)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              กำหนดตัวเลือกสำหรับ Customer, Creator และ Approve Report เพื่อให้เลือกจาก Dropdown ได้ทันที
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'customers'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Customer (ลูกค้า)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-normal">
              {customers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('creators')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'creators'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Creator (ผู้จัดทำ)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-normal">
              {creators.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approvers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'approvers'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Approve Report (ผู้อนุมัติ)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-normal">
              {approvers.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {savedSuccess && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>บันทึกข้อมูลหลักเรียบร้อยและซิงค์ขึ้น Cloud ทันที</span>
            </div>
          )}

          {/* Tab 1: Customer */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <form onSubmit={handleAddCustomer} className="flex gap-2">
                <input
                  type="text"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  placeholder="เช่น Toyota (TMT), Honda (HATC), Isuzu..."
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มลูกค้า</span>
                </button>
              </form>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {customers.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5 font-medium text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span>{c}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomer(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 transition cursor-pointer"
                      title="ลบรายการนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400">
                    ยังไม่มีข้อมูลลูกค้าในระบบ กรุณาเพิ่มชื่อลูกค้า
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Creator */}
          {activeTab === 'creators' && (
            <div className="space-y-4">
              <form onSubmit={handleAddCreator} className="flex gap-2">
                <input
                  type="text"
                  value={newCreator}
                  onChange={(e) => setNewCreator(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี (วิศวกรทดสอบ), ช่างเทคนิค Trial..."
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มผู้จัดทำ</span>
                </button>
              </form>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {creators.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5 font-medium text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span>{c}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCreator(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 transition cursor-pointer"
                      title="ลบรายการนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {creators.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400">
                    ยังไม่มีข้อมูลผู้จัดทำในระบบ กรุณาเพิ่มชื่อผู้จัดทำ
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Approver */}
          {activeTab === 'approvers' && (
            <div className="space-y-4">
              <form onSubmit={handleAddApprover} className="flex gap-2">
                <input
                  type="text"
                  value={newApprover}
                  onChange={(e) => setNewApprover(e.target.value)}
                  placeholder="เช่น ผจก. แผนกวิศวกรรม, ผู้จัดการฝ่ายผลิต..."
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มผู้อนุมัติ</span>
                </button>
              </form>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {approvers.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5 font-medium text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span>{c}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveApprover(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 transition cursor-pointer"
                      title="ลบรายการนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {approvers.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400">
                    ยังไม่มีข้อมูลผู้อนุมัติในระบบ กรุณาเพิ่มชื่อผู้อนุมัติ
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น (Reset Defaults)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
          >
            เสร็จสิ้น (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
