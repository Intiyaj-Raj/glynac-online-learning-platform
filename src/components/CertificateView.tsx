import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  Share2, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  QrCode,
  Sparkles,
  Download,
  Copy
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { Certificate } from '../types';

interface CertificateViewProps {
  onBack: () => void;
  selectedCourseId?: string;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ onBack, selectedCourseId }) => {
  const { userProgress, courses, issueCertificate, updateLearnerName } = useLearning();

  const [activeCertId, setActiveCertId] = useState<string>(() => {
    if (selectedCourseId) {
      const match = userProgress.certificates.find(c => c.courseId === selectedCourseId);
      if (match) return match.id;
    }
    return userProgress.certificates[0]?.id || '';
  });

  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProgress.learnerName);

  // If user has no certificate yet, allow one-click claim for preview
  const handleClaimSampleCert = (courseId: string) => {
    const newCert = issueCertificate(courseId, 96);
    setActiveCertId(newCert.id);
  };

  const currentCert = userProgress.certificates.find(c => c.id === activeCertId) || userProgress.certificates[0];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearnerName(editedName);
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Controls Bar (Hidden in Print) */}
      <div className="no-print border-b border-slate-800 bg-slate-900/90 py-4 px-4 sm:px-6 lg:px-8 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="flex flex-wrap items-center gap-3">
            {/* Certificate Switcher if user has multiple */}
            {userProgress.certificates.length > 1 && (
              <select
                value={currentCert?.id}
                onChange={(e) => setActiveCertId(e.target.value)}
                aria-label="Select earned certificate"
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {userProgress.certificates.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.courseTitle.slice(0, 30)}...
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share Credential'}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Certificate Display Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* If no certificate earned yet */}
        {!currentCert ? (
          <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Verified Certificates Yet</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Complete any curriculum and achieve at least 70% in the module assessment quizzes to earn an accredited certificate.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleClaimSampleCert('course-react-fullstack')}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Claim Sample Credential: React & Next.js Architecture
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Return to Course Catalog
              </button>
            </div>
          </div>
        ) : (
          /* Real Printable Certificate Canvas Container */
          <div className="space-y-6">
            
            {/* Quick Name Customization helper (Hidden in Print) */}
            <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Certificate issued to: <strong className="text-white">{userProgress.learnerName}</strong>
                </span>
              </div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter legal name"
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded bg-indigo-600 text-white text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
                >
                  Edit Legal Name on Certificate
                </button>
              )}
            </div>

            {/* Official Certificate Box */}
            <div className="print-certificate-container bg-slate-900 border-8 border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-slate-100">
              
              {/* Outer Golden Certificate Border Pattern */}
              <div className="absolute inset-2 border-2 border-amber-500/30 rounded-2xl pointer-events-none" />
              <div className="absolute inset-3 border border-amber-500/10 rounded-xl pointer-events-none" />

              {/* Watermark Logo Pattern */}
              <div className="absolute -right-12 -bottom-12 w-80 h-80 opacity-5 pointer-events-none">
                <Award className="w-full h-full text-white" />
              </div>

              {/* Certificate Header */}
              <div className="text-center relative z-10 mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-extrabold uppercase tracking-widest mb-4">
                  <Award className="w-4 h-4 text-amber-400" />
                  glynac e-learn Verified Credential
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif uppercase">
                  Certificate of Achievement
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                  This hereby certifies that
                </p>
              </div>

              {/* Recipient Name */}
              <div className="text-center relative z-10 my-8 py-3 border-b-2 border-amber-500/40 max-w-lg mx-auto">
                <h3 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-amber-200 tracking-tight">
                  {userProgress.learnerName}
                </h3>
              </div>

              {/* Accomplishment Text */}
              <div className="text-center max-w-2xl mx-auto relative z-10 space-y-3 mb-10">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  has successfully demonstrated technical mastery, completed all curriculum modules, and passed comprehensive assessment examinations for:
                </p>
                <h4 className="text-lg sm:text-2xl font-bold text-white text-indigo-300">
                  {currentCert.courseTitle}
                </h4>
                <p className="text-xs text-slate-400">
                  Graduated with an examination grade of <strong className="text-emerald-400">{currentCert.scorePercent}%</strong> • Equivalent to {currentCert.totalHours} of rigorous engineering coursework.
                </p>
              </div>

              {/* Bottom Signatures & Verifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-end relative z-10 pt-8 border-t border-slate-800">
                
                {/* Left: Date & Credential ID */}
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date of Issuance</p>
                  <p className="text-xs font-semibold text-white">{currentCert.issueDate}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-2">
                    ID: {currentCert.credentialId}
                  </p>
                </div>

                {/* Center: Gold Official Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-2 border-2 border-dashed border-amber-400/50">
                      <Award className="w-6 h-6 text-amber-400" />
                      <span className="text-[8px] font-black uppercase text-amber-300 tracking-tighter mt-0.5">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Instructor Digital Signature */}
                <div className="space-y-1 text-center sm:text-right">
                  <div className="h-9 flex items-center justify-center sm:justify-end">
                    <span className="font-serif italic text-lg sm:text-xl text-indigo-300 font-semibold tracking-wide">
                      {currentCert.instructorName}
                    </span>
                  </div>
                  <div className="w-40 sm:ml-auto h-0.5 bg-slate-700 mx-auto" />
                  <p className="text-xs font-bold text-white pt-1">{currentCert.instructorName}</p>
                  <p className="text-[10px] text-slate-400">{currentCert.instructorTitle}</p>
                </div>
              </div>

              {/* Footer Verification Link */}
              <div className="mt-8 pt-4 border-t border-slate-800/60 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>Verified by glynac e-learn Academy Accreditation Engine</span>
                <span className="font-mono text-slate-400">https://glynac-elearn.io/verify/{currentCert.credentialId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
