import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars -- motion used via JSX member tag (<motion.div>)
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "$ initializing_portfolio...",
  "$ loading modules [react, three.js, node]...",
  "$ compiling experience.jsx...",
  "$ ready.",
];

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= LINES.length) {
      const exitTimer = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(exitTimer);
    }
    const timer = setTimeout(() => setLineIndex((i) => i + 1), 320);
    return () => clearTimeout(timer);
  }, [lineIndex]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="font-mono text-sm sm:text-base text-primary w-[min(90vw,420px)]">
            {LINES.slice(0, lineIndex).map((line, i) => (
              <p key={i} className="mb-1 text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="inline-flex items-center gap-2">
              <span className="w-2.5 h-4 bg-primary blink-caret inline-block" />
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
