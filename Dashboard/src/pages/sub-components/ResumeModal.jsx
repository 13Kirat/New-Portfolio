import React from "react";
import { X } from "lucide-react";

const ResumeModal = ({ isOpen, onClose, resumeUrl, resumeName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-[1000px] h-[90vh] bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{resumeName || "Resume"}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 w-full h-full bg-slate-100 dark:bg-slate-800">
          <iframe
            src={resumeUrl}
            title={resumeName || "Resume"}
            className="w-full h-full border-none"
            type="application/pdf"
          >
            <p>Your browser does not support iframes. 
               <a href={resumeUrl} target="_blank" rel="noreferrer">Click here to view the PDF</a>
            </p>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
