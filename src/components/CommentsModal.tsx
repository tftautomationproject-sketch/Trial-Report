import React, { useState } from 'react';
import { X, Send, Trash2, User, ShieldCheck, MessageSquare } from 'lucide-react';
import { TrialReport, CommentItem, UserRole } from '../types';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: TrialReport | null;
  role: UserRole;
  onAddComment: (reportId: string, comment: CommentItem) => void;
  onDeleteComment: (reportId: string, commentId: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  report,
  role,
  onAddComment,
  onDeleteComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(
    role === 'Admin' ? 'Admin Engineer' : 'Operator / Quality Inspector'
  );

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      author: authorName.trim() || (role === 'Admin' ? 'Admin' : 'User'),
      role,
      text: commentText.trim(),
      timestamp: new Date().toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    onAddComment(report.id, newComment);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0f2b5c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Comments (ความคิดเห็น / บันทึกหน้างาน)
              </h3>
              <p className="text-xs text-blue-200">
                {report.reportNo} • {report.jigSubAssy}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5 bg-slate-50">
          {report.comments && report.comments.length > 0 ? (
            report.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {comment.role === 'Admin' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                        <ShieldCheck className="w-3 h-3 text-[#1e3a8a]" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        <User className="w-3 h-3 text-slate-500" />
                        User
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-900">
                      {comment.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {comment.timestamp}
                    </span>
                    {role === 'Admin' && (
                      <button
                        onClick={() => onDeleteComment(report.id, comment.id)}
                        className="text-slate-300 hover:text-red-500 p-0.5 transition"
                        title="ลบความคิดเห็น (Admin only)"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed pl-1">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">ยังไม่มีความคิดเห็นในรายงานนี้</p>
              <p className="text-[11px] text-slate-400">
                ผู้ใช้ในโหมด User หรือ Admin สามารถพิมพ์ความคิดเห็นด้านล่างได้
              </p>
            </div>
          )}
        </div>

        {/* Add Comment Input Form (Available for both User & Admin modes!) */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">ผู้เขียน:</span>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="ชื่อผู้เขียน / แผนก"
              className="flex-1 px-2.5 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#1e3a8a]"
            />
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">
              {role === 'Admin' ? 'โหมด Admin' : 'โหมด User'}
            </span>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="พิมพ์ความคิดเห็น หรือ ข้อเสนอแนะเกี่ยวกับรายงานนี้... (Write a comment)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 h-10"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>ส่ง (Send)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
