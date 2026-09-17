import React, { useState, useEffect } from 'react';
import { TrialReport, UserRole, AppConfig, CommentItem } from './types';
import { INITIAL_REPORTS, DEFAULT_APP_CONFIG } from './mockData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ReportList } from './components/ReportList';
import { ReportForm } from './components/ReportForm';
import { LandscapeReportView } from './components/LandscapeReportView';
import { CommentsModal } from './components/CommentsModal';
import { ProfileIconModal } from './components/ProfileIconModal';
import { MasterDataModal } from './components/MasterDataModal';
import { ProblemBase } from './components/ProblemBase';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { ApprovalModal } from './components/ApprovalModal';
import { 
  subscribeToReports, 
  subscribeToConfig, 
  saveReportToFirestore, 
  deleteReportFromFirestore, 
  saveConfigToFirestore,
  testConnection
} from './firebase';

const STORAGE_KEY_ROLE = 'trial_report_role_v1';

export default function App() {
  // Reports State - Synced in real-time with Firebase Firestore
  const [reports, setReports] = useState<TrialReport[]>(INITIAL_REPORTS);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // App Config (Logo & Company Name & Master Data lists) - Synced with Firebase
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);

  // Current Role: Default to 'User' so visitors start in safe read/comment mode, with 'Admin' protected by passcode 0096
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      if (saved === 'User' || saved === 'Admin') return saved;
    } catch (e) {
      console.error('Failed to load role', e);
    }
    return 'User';
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'reports' | 'problem-base' | 'create'>('reports');

  // Active Modals & Views
  const [viewingReport, setViewingReport] = useState<TrialReport | null>(null);
  const [editingReport, setEditingReport] = useState<TrialReport | null>(null);
  const [commentingReport, setCommentingReport] = useState<TrialReport | null>(null);
  const [approvingReport, setApprovingReport] = useState<TrialReport | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMasterDataModalOpen, setIsMasterDataModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [reportPendingDelete, setReportPendingDelete] = useState<TrialReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Connect to Firebase Firestore Real-Time Stream
  useEffect(() => {
    // 0. Verify connection to Firestore backend
    testConnection().then((connected) => {
      if (connected) setIsFirebaseConnected(true);
    });

    // 1. Subscribe to real-time reports
    const unsubscribeReports = subscribeToReports(
      (firestoreReports) => {
        setReports(firestoreReports);
        setIsFirebaseConnected(true);

        // Keep any active open modal report synchronized in real-time
        if (viewingReport) {
          const fresh = firestoreReports.find((r) => r.id === viewingReport.id);
          if (fresh) setViewingReport(fresh);
        }
        if (commentingReport) {
          const fresh = firestoreReports.find((r) => r.id === commentingReport.id);
          if (fresh) setCommentingReport(fresh);
        }
        if (approvingReport) {
          const fresh = firestoreReports.find((r) => r.id === approvingReport.id);
          if (fresh) setApprovingReport(fresh);
        }
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 2. Subscribe to real-time app config
    const unsubscribeConfig = subscribeToConfig((remoteConfig) => {
      setConfig(remoteConfig);
      if (remoteConfig.logoUrl) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = remoteConfig.logoUrl;
      }
    });

    return () => {
      unsubscribeReports();
      unsubscribeConfig();
    };
  }, [viewingReport?.id, commentingReport?.id, approvingReport?.id]);

  // Persist role in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    } catch (e) {
      console.error('Failed to save role to localStorage', e);
    }
  }, [role]);

  // Handle switching to Admin mode with passcode 0096
  const handleRequestAdmin = () => {
    setIsAdminPasswordModalOpen(true);
  };

  const handleAdminAuthSuccess = () => {
    setRole('Admin');
    setToastMessage('เข้าสู่โหมด Admin สำเร็จ (Authorized)');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSwitchToUser = () => {
    setRole('User');
    if (currentTab === 'create') {
      setCurrentTab('reports');
    }
    setToastMessage('สลับสู่โหมด User เรียบร้อยแล้ว');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save or Update Report (Real-time Cloud Sync)
  const handleSaveReport = async (savedReport: TrialReport) => {
    // Optimistic local update
    setReports((prev) => {
      const existsIndex = prev.findIndex((r) => r.id === savedReport.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedReport;
        return updated;
      }
      return [savedReport, ...prev];
    });

    setEditingReport(null);
    setCurrentTab('reports');
    setViewingReport(savedReport);

    try {
      await saveReportToFirestore(savedReport);
      setToastMessage(`บันทึกรายงาน ${savedReport.reportNo} ขึ้น Cloud สำเร็จ ทุกคนจะเห็นตรงกัน`);
    } catch (err) {
      console.error('Failed to save report to Firestore:', err);
      setToastMessage(`บันทึกข้อมูลเรียบร้อยแล้ว (${savedReport.reportNo})`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Delete Report Request
  const handleDeleteReportRequest = (report: TrialReport) => {
    if (role !== 'Admin') {
      handleRequestAdmin();
      return;
    }
    setReportPendingDelete(report);
  };

  // Confirm and Execute Report Deletion (Real-time Cloud Sync)
  const handleConfirmDelete = async () => {
    if (!reportPendingDelete) return;
    const targetId = reportPendingDelete.id;
    const targetNo = reportPendingDelete.reportNo;

    // Optimistic local update
    setReports((prev) => prev.filter((r) => r.id !== targetId));

    if (viewingReport?.id === targetId) setViewingReport(null);
    if (commentingReport?.id === targetId) setCommentingReport(null);
    if (editingReport?.id === targetId) setEditingReport(null);
    setReportPendingDelete(null);

    try {
      await deleteReportFromFirestore(targetId);
      setToastMessage(`ลบรายงาน ${targetNo} ออกจากระบบและ Cloud สำเร็จ`);
    } catch (err) {
      console.error('Failed to delete report from Firestore:', err);
      setToastMessage(`ลบรายงาน ${targetNo} สำเร็จ`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Duplicate Report
  const handleDuplicateReport = async (report: TrialReport) => {
    if (role !== 'Admin') {
      handleRequestAdmin();
      return;
    }
    const newId = `TR-${Date.now()}`;
    const duplicated: TrialReport = {
      ...report,
      id: newId,
      reportNo: `${report.reportNo}-COPY`,
      title: `${report.title} (สำเนา)`,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReports((prev) => [duplicated, ...prev]);

    try {
      await saveReportToFirestore(duplicated);
      setToastMessage(`คัดลอกรายงาน ${duplicated.reportNo} เรียบร้อยแล้ว`);
    } catch (err) {
      console.error('Failed to sync duplicated report to Firestore:', err);
      setToastMessage(`คัดลอกรายงาน ${duplicated.reportNo} สำเร็จ`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add Comment (Synced to Cloud)
  const handleAddComment = async (reportId: string, newComment: CommentItem) => {
    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport) return;

    const updatedComments = [...(targetReport.comments || []), newComment];
    const updatedReport: TrialReport = {
      ...targetReport,
      comments: updatedComments,
      updatedAt: new Date().toISOString()
    };

    // Update local state
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? updatedReport : r))
    );
    if (viewingReport?.id === reportId) setViewingReport(updatedReport);
    if (commentingReport?.id === reportId) setCommentingReport(updatedReport);

    // Save to Firestore
    try {
      await saveReportToFirestore(updatedReport);
    } catch (err) {
      console.error('Failed to save comment to Firestore:', err);
    }
  };

  // Delete Comment (Admin only)
  const handleDeleteComment = async (reportId: string, commentId: string) => {
    if (role !== 'Admin') {
      handleRequestAdmin();
      return;
    }
    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport) return;

    const updatedComments = targetReport.comments.filter((c) => c.id !== commentId);
    const updatedReport: TrialReport = {
      ...targetReport,
      comments: updatedComments,
      updatedAt: new Date().toISOString()
    };

    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? updatedReport : r))
    );
    if (viewingReport?.id === reportId) setViewingReport(updatedReport);
    if (commentingReport?.id === reportId) setCommentingReport(updatedReport);

    try {
      await saveReportToFirestore(updatedReport);
    } catch (err) {
      console.error('Failed to update comments in Firestore:', err);
    }
  };

  // Open Approval Modal
  const handleOpenApproval = (report: TrialReport) => {
    setApprovingReport(report);
  };

  // Handle Approving Report (Verified by passcode 0096)
  const handleApproveReport = async (reportId: string, approverName: string, remark?: string) => {
    const target = reports.find((r) => r.id === reportId);
    if (!target) return;

    const nowStr = new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const updatedReport: TrialReport = {
      ...target,
      approvalStatus: 'Approved',
      approvedDate: nowStr,
      approvedBy: approverName,
      approver: approverName,
      approvalRemark: remark?.trim() || null,
      updatedAt: nowStr
    };

    setReports((prev) => prev.map((r) => (r.id === reportId ? updatedReport : r)));
    if (viewingReport?.id === reportId) setViewingReport(updatedReport);
    if (approvingReport?.id === reportId) setApprovingReport(updatedReport);

    try {
      await saveReportToFirestore(updatedReport);
      setToastMessage(`อนุมัติรายงาน ${target.reportNo} สำเร็จ (โดย ${approverName})`);
    } catch (err) {
      console.error('Failed to save approval to Firestore:', err);
      setToastMessage(`อนุมัติรายงาน ${target.reportNo} สำเร็จ`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Revoking Report Approval (Verified by passcode 0096)
  const handleRevokeApproval = async (reportId: string) => {
    const target = reports.find((r) => r.id === reportId);
    if (!target) return;

    const nowStr = new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const updatedReport: TrialReport = {
      ...target,
      approvalStatus: 'Pending',
      approvedDate: null,
      approvedBy: null,
      approvalRemark: null,
      updatedAt: nowStr
    };

    setReports((prev) => prev.map((r) => (r.id === reportId ? updatedReport : r)));
    if (viewingReport?.id === reportId) setViewingReport(updatedReport);
    if (approvingReport?.id === reportId) setApprovingReport(updatedReport);

    try {
      await saveReportToFirestore(updatedReport);
      setToastMessage(`ยกเลิกการอนุมัติรายงาน ${target.reportNo} เรียบร้อยแล้ว`);
    } catch (err) {
      console.error('Failed to revoke approval in Firestore:', err);
      setToastMessage(`ยกเลิกการอนุมัติรายงาน ${target.reportNo} สำเร็จ`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Update App Config (Save to Cloud)
  const handleSaveConfig = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      await saveConfigToFirestore(newConfig);
      setToastMessage('บันทึกการตั้งค่าระบบและโลโก้ขึ้น Cloud เรียบร้อย');
    } catch (err) {
      console.error('Failed to save config to Firestore:', err);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'create' && role !== 'Admin') {
            handleRequestAdmin();
            return;
          }
          if (tab === 'create') {
            setEditingReport(null);
          }
          setCurrentTab(tab);
        }}
        role={role}
        onRequestAdmin={handleRequestAdmin}
        onSwitchToUser={handleSwitchToUser}
        config={config}
        onOpenProfileModal={() => {
          if (role !== 'Admin') {
            handleRequestAdmin();
            return;
          }
          setIsProfileModalOpen(true);
        }}
        onOpenMasterData={() => {
          if (role !== 'Admin') {
            handleRequestAdmin();
            return;
          }
          setIsMasterDataModalOpen(true);
        }}
        totalReportsCount={reports.length}
      />

      {/* Cloud Sync Status Indicator */}
      <div className="bg-slate-100/80 border-b border-slate-200/60 px-4 py-1 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="font-medium">
            {isFirebaseConnected 
              ? 'Cloud Database (Firebase Firestore) เชื่อมต่อเรียบร้อย — ข้อมูลอัปเดตตรงกันทุกคนแบบ Real-time'
              : 'โหมด Offline / Local Storage พร้อมทำงาน'}
          </span>
          <span className="ml-auto font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
            โหมดปัจจุบัน: <strong className={role === 'Admin' ? 'text-[#1e3a8a]' : 'text-slate-700'}>{role}</strong>
          </span>
        </div>
      </div>

      {/* Main Content Pages */}
      <main className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          <Dashboard
            reports={reports}
            onViewReport={(rep) => setViewingReport(rep)}
            onNavigateToReports={() => setCurrentTab('reports')}
            onOpenApproval={handleOpenApproval}
          />
        )}

        {currentTab === 'reports' && (
          <ReportList
            reports={reports}
            role={role}
            onViewReport={(rep) => setViewingReport(rep)}
            onEditReport={(rep) => {
              if (role !== 'Admin') {
                handleRequestAdmin();
                return;
              }
              setEditingReport(rep);
              setCurrentTab('create');
            }}
            onDeleteReport={handleDeleteReportRequest}
            onDuplicateReport={handleDuplicateReport}
            onOpenComments={(rep) => setCommentingReport(rep)}
            onOpenApproval={handleOpenApproval}
            onCreateNew={() => {
              if (role !== 'Admin') {
                handleRequestAdmin();
                return;
              }
              setEditingReport(null);
              setCurrentTab('create');
            }}
          />
        )}

        {currentTab === 'problem-base' && (
          <ProblemBase
            reports={reports}
            onViewReport={(rep) => setViewingReport(rep)}
            config={config}
          />
        )}

        {currentTab === 'create' && (
          <ReportForm
            initialReport={editingReport}
            config={config}
            onSave={handleSaveReport}
            onCancel={() => {
              setEditingReport(null);
              setCurrentTab('reports');
            }}
            onPreview={(draft) => setViewingReport(draft)}
            onOpenMasterData={() => {
              if (role !== 'Admin') {
                handleRequestAdmin();
                return;
              }
              setIsMasterDataModalOpen(true);
            }}
          />
        )}
      </main>

      {/* 1-Page Landscape Report Modal View & Export */}
      {viewingReport && (
        <LandscapeReportView
          report={viewingReport}
          config={config}
          onClose={() => setViewingReport(null)}
          onOpenComments={() => setCommentingReport(viewingReport)}
          onOpenApproval={() => handleOpenApproval(viewingReport)}
          onDelete={() => handleDeleteReportRequest(viewingReport)}
          onEdit={
            role === 'Admin'
              ? () => {
                  setEditingReport(viewingReport);
                  setViewingReport(null);
                  setCurrentTab('create');
                }
              : undefined
          }
          isAdmin={role === 'Admin'}
        />
      )}

      {/* Approval Passcode Modal (Passcode: 0096) */}
      <ApprovalModal
        report={approvingReport}
        config={config}
        isOpen={!!approvingReport}
        onClose={() => setApprovingReport(null)}
        onApprove={handleApproveReport}
        onRevokeApproval={handleRevokeApproval}
      />

      {/* Comments Thread Modal */}
      <CommentsModal
        isOpen={!!commentingReport}
        onClose={() => setCommentingReport(null)}
        report={commentingReport}
        role={role}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />

      {/* Profile / Web Icon Upload Modal */}
      <ProfileIconModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Master Data Management Modal (Customers, Creators, Approvers) */}
      <MasterDataModal
        isOpen={isMasterDataModalOpen}
        onClose={() => setIsMasterDataModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Admin Passcode Authentication Modal */}
      <AdminPasswordModal
        isOpen={isAdminPasswordModalOpen}
        onClose={() => setIsAdminPasswordModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* In-App Delete Confirmation Modal (100% reliable inside iframe) */}
      <DeleteConfirmModal
        report={reportPendingDelete}
        isOpen={!!reportPendingDelete}
        onClose={() => setReportPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Success / Alert Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0f2b5c] text-white rounded-xl shadow-2xl border border-blue-400/30 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
