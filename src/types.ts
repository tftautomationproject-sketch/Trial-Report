export type ReportStatus = 'Draft' | 'Under Review' | 'Approved' | 'Completed';

export type ProblemSeverity = 'High' | 'Medium' | 'Low';
export type ProblemStatus = 'Pending' | 'In Progress' | 'Solved';

export interface ProblemItem {
  id: string;
  orderNumber: number; // 1 to 5
  title: string; // e.g., "1. ปัญหาที่พบ"
  description: string; // e.g. "- ไม่มี Jig Setting ระยะ Control 3 mm"
  countermeasure: string; // e.g. "- ออกแบบ Jig Setting ใหม่"
  images: string[]; // 1 to 2 images
  imageCaptions?: string[];
  severity: ProblemSeverity;
  status: ProblemStatus;
}

export interface CommentItem {
  id: string;
  author: string;
  role: 'User' | 'Admin';
  text: string;
  timestamp: string;
}

export interface TrialReport {
  id: string;
  reportNo: string;
  title: string; // "Trial Report"
  jigSubAssy: string; // JIG Name e.g. "JIG : Rear Arm Frame"
  partName: string;
  partNumber: string;
  line: string;
  date: string;
  author: string;
  creator?: string | null; // ผู้จัดทำรายงาน (Creator)
  customer?: string | null; // ลูกค้า (Customer)
  approver?: string | null; // ผู้อนุมัติรายงาน (Approver)
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
  approvedDate?: string | null;
  approvedBy?: string | null; // ชื่อผู้ที่กดอนุมัติจริง
  approvalRemark?: string | null; // ความเห็น / บันทึกเพิ่มเติมการอนุมัติ
  trialRound: string; // "Trial #1", "Trial #2", "SOP Trial"
  status?: ReportStatus | null; // Optional status
  
  // Header Section
  headerImage1: string; // Main assembly/jig photo
  headerImage1Caption?: string | null;
  headerImage2: string; // Secondary focus/hand-holding pipe photo
  headerImage2Caption?: string | null;
  keyProblemsSummary: string[]; // "สรุป ปัญหาหลัก"
  
  // Problems Section (1 - 5 items)
  problems: ProblemItem[];
  
  // Comments
  comments: CommentItem[];
  
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'User' | 'Admin';

export interface AppConfig {
  logoUrl: string;
  companyName: string;
  customers?: string[];
  creators?: string[];
  approvers?: string[];
}
