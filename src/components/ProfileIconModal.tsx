import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { AppConfig } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface ProfileIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (config: AppConfig) => void;
}

export const ProfileIconModal: React.FC<ProfileIconModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [logoUrl, setLogoUrl] = useState(config.logoUrl);
  const [companyName, setCompanyName] = useState(config.companyName);
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('ไฟล์มีขนาดใหญ่เกิน 10MB กรุณาเลือกไฟล์ขนาดเล็กกว่านี้ (File size exceeds 10MB)');
        return;
      }
      try {
        const compressed = await compressImageFile(file, 400, 400, 0.8);
        setLogoUrl(compressed);
        setPreviewError(false);
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setLogoUrl(result);
          setPreviewError(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = () => {
    onSaveConfig({
      logoUrl,
      companyName: companyName.trim() || 'Trial Report System'
    });
    // Update browser favicon if logo provided
    if (logoUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = logoUrl;
      }
    }
    onClose();
  };

  const handleReset = () => {
    setLogoUrl('');
    setCompanyName('Trial Report System');
    setPreviewError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f2b5c] text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Profile & Web Icon (เปลี่ยนรูปและไอคอนเว็บ)</h3>
            <p className="text-xs text-blue-200">ตั้งค่าโลโก้บริษัทและไอคอนประจำระบบ Trial Report</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Logo Preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden mb-3">
              {logoUrl && !previewError ? (
                <img
                  src={logoUrl}
                  alt="Web Icon Preview"
                  className="w-full h-full object-contain p-1"
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="w-full h-full bg-[#1e3a8a] text-white flex flex-col items-center justify-center font-bold">
                  <span className="text-2xl">TR</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">Report</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">รูปตัวอย่างไอคอนเว็บ (Web Icon & Favicon)</p>
          </div>

          {/* Upload Button */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              อัพโหลดไฟล์รูปภาพ (Upload Image - PNG, JPG, SVG)
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 cursor-pointer transition text-sm font-medium text-slate-700">
              <Upload className="w-4 h-4 text-[#1e3a8a]" />
              <span>เลือกไฟล์จากเครื่อง (Choose File)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-slate-500 mt-1">แนะนำรูปทรงสี่เหลี่ยมจัตุรัส ขนาดไม่เกิน 2MB</p>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              ชื่อองค์กร / แผนก (Company / Department Name)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. KKM Engineering / Production Dept"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น (Reset Default)</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              ยกเลิก (Cancel)
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-[#1e3a8a] hover:bg-blue-900 rounded-lg shadow-sm transition"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>บันทึก (Save Changes)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
