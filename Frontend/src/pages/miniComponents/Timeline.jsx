import axios from "axios";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { sortTimelineByRecency } from "@/lib/parseTimelineDate";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  useEffect(() => {
    const getMyTimeline = async () => {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/timeline/getall`,
        { withCredentials: true }
      );
      setTimeline(sortTimelineByRecency(data.timelines));
    };
    getMyTimeline();
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      <SectionHeading kicker="where i've been" title="EXPERI" accent="ENCE" />
      <ol className="relative border-s-2 border-primary/20 ml-3">
        {timeline &&
          timeline.map((element, i) => (
            <Reveal key={element?._id} delay={(i % 8) * 0.05} className="mb-10 ms-8 relative">
              <span className="absolute -start-[41px] flex items-center justify-center w-6 h-6 rounded-full bg-background border-2 border-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </span>
              <div className="terminal-window p-4 sm:p-5">
                <h3 className="font-mono text-base sm:text-lg font-semibold text-foreground">
                  {element?.title}
                </h3>
                <time className="block mb-2 font-mono text-xs text-primary/80">
                  {element?.timeline?.from} — {element?.timeline?.to ? element?.timeline?.to : "Present"}
                </time>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {element?.description}
                </p>
              </div>
            </Reveal>
          ))}
      </ol>
    </div>
  );
};

export default Timeline;
