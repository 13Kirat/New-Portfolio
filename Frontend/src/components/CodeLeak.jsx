import React, { useMemo } from "react";
import { getRandomSnippets } from "@/data/codeSnippets";

// Renders a handful of decorative, non-interactive floating code fragments
// positioned absolutely within a `relative` ancestor. Purely visual flavor.
const CodeLeak = ({ count = 4, seed = 1, positions }) => {
  const snippets = useMemo(() => getRandomSnippets(count, seed), [count, seed]);

  const defaultPositions = [
    { top: "6%", left: "2%", rotate: -8 },
    { top: "62%", left: "-3%", rotate: 6 },
    { top: "12%", right: "0%", rotate: 7 },
    { top: "70%", right: "3%", rotate: -6 },
    { top: "38%", left: "45%", rotate: 4 },
  ];

  const layout = positions || defaultPositions;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block" aria-hidden="true">
      {snippets.map((snippet, i) => {
        const pos = layout[i % layout.length];
        return (
          <pre
            key={`${snippet.lang}-${i}`}
            className="code-leak animate-float-slow"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              transform: `rotate(${pos.rotate}deg)`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            {snippet.lines.map((line, li) => (
              <div key={li}>
                {line.map((tok, ti) => (
                  <span key={ti} className={tok.c}>
                    {tok.t}
                  </span>
                ))}
              </div>
            ))}
          </pre>
        );
      })}
    </div>
  );
};

export default CodeLeak;
