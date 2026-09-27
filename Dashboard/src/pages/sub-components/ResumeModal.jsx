import { X } from "lucide-react";

const ResumeModal = ({ isOpen, onClose, resumeUrl, resumeName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
      <div className="terminal-window relative w-full max-w-[1000px] h-[90vh] flex flex-col">
        <div className="terminal-window-bar justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-window-dot bg-[#ff5f56]" />
            <span className="terminal-window-dot bg-[#ffbd2e]" />
            <span className="terminal-window-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              {resumeName || "resume.pdf"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 w-full h-full bg-muted/40">
          <iframe
            src={resumeUrl}
            title={resumeName || "Resume"}
            className="w-full h-full border-none"
            type="application/pdf"
          >
            <p>
              Your browser does not support iframes.
              <a href={resumeUrl} target="_blank" rel="noreferrer">Click here to view the PDF</a>
            </p>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
