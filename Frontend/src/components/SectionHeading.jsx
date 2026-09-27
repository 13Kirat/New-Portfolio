import React from "react";
import Reveal from "@/components/Reveal";

// Shared section heading used across About/Skills/Experience/Projects/Apps/Contact.
// Renders as: `// kicker`  TITLE <accent>ACCENT</accent>
const SectionHeading = ({ kicker, title, accent, align = "center", className = "" }) => {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <Reveal className={`w-full flex flex-col gap-2 ${alignClass} ${className}`}>
      {kicker && (
        <span className="font-mono text-sm text-primary/80 tracking-wide">
          // {kicker}
        </span>
      )}
      <h2 className="animate-glitch-in font-mono font-extrabold uppercase text-[1.9rem] sm:text-[2.5rem] md:text-[3rem] tracking-[6px] sm:tracking-[10px]">
        {title} <span className="text-gradient">{accent}</span>
      </h2>
      <span className="h-[2px] w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
    </Reveal>
  );
};

export default SectionHeading;
