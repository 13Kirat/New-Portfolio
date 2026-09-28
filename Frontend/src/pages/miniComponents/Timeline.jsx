import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { sortTimelineByRecency } from "@/lib/parseTimelineDate";
import { ChevronRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Deterministic fake commit hash so it stays stable across renders/reloads.
function shortHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16).padStart(7, "0").slice(0, 7);
}

const Badge = ({ tone, children }) => {
  const tones = {
    primary: "border-primary/30 text-primary/90 bg-primary/5",
    accent: "border-accent/30 text-accent/90 bg-accent/5",
    muted: "border-border text-muted-foreground",
  };
  return (
    <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full border ${tones[tone]}`}>
      {children}
    </span>
  );
};

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [expanded, setExpanded] = useState(() => new Set());

  useEffect(() => {
    const getMyTimeline = async () => {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/timeline/getall`,
        { withCredentials: true }
      );
      const sorted = sortTimelineByRecency(data.timelines);
      setTimeline(sorted);
      setExpanded(sorted[0]?._id ? new Set([sorted[0]._id]) : new Set());
    };
    getMyTimeline();
  }, []);

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hashes = useMemo(
    () =>
      Object.fromEntries(
        timeline.map((e) => [e._id, shortHash(`${e.title}${e.timeline?.from}${e.timeline?.to}`)])
      ),
    [timeline]
  );

  return (
    <div className="w-full flex flex-col gap-10">
      <SectionHeading kicker="where i've been" title="EXPERI" accent="ENCE" />

      <div className="terminal-window">
        <div className="terminal-window-bar">
          <span className="terminal-window-dot bg-[#ff5f56]" />
          <span className="terminal-window-dot bg-[#ffbd2e]" />
          <span className="terminal-window-dot bg-[#27c93f]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">git-log.sh</span>
        </div>

        <div className="p-5 sm:p-6 font-mono">
          <p className="text-primary text-sm mb-6">
            <span className="text-muted-foreground">$</span> git log --graph --decorate --all
          </p>

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />

            {timeline.map((element, i) => {
              const isOpen = expanded.has(element._id);
              const isHead = i === 0;
              return (
                <Reveal key={element._id} delay={(i % 8) * 0.05} className="relative pl-8 pb-8 last:pb-0">
                  <span
                    className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 bg-background ${
                      isHead ? "border-primary" : "border-muted-foreground/50"
                    }`}
                  >
                    {isHead && (
                      <span className="absolute inset-0.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </span>

                  <button
                    onClick={() => toggle(element._id)}
                    className="w-full text-left group"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                      <span className="text-accent text-sm">{hashes[element._id]}</span>
                      {isHead && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-primary/40 text-primary">
                          HEAD -&gt; main
                        </span>
                      )}
                      <span className="text-foreground text-sm sm:text-base font-semibold group-hover:text-primary transition-colors">
                        {element.title}
                      </span>
                    </div>
                    <time className="block mt-1 text-xs text-muted-foreground pl-[22px]">
                      {element.timeline?.from} — {element.timeline?.to || "Present"}
                    </time>
                  </button>

                  {isOpen && (
                    <div className="pl-[22px] mt-3 flex flex-col gap-3">
                      {(element.employmentType || element.locationType || element.location) && (
                        <div className="flex flex-wrap gap-1.5">
                          {element.employmentType && <Badge tone="primary">{element.employmentType}</Badge>}
                          {element.locationType && <Badge tone="accent">{element.locationType}</Badge>}
                          {element.location && <Badge tone="muted">{element.location}</Badge>}
                        </div>
                      )}
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed border-l-2 border-border pl-4">
                        {element.description}
                      </p>
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
