import axios from "axios";
import { lazy, Suspense, useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import IconCard from "@/components/IconCard";
import { useIsDesktop } from "@/lib/useIsDesktop";

const SkillsOrbit = lazy(() => import("@/components/three/SkillsOrbit"));

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const getMySkills = async () => {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/skill/getall`,
        { withCredentials: true }
      );
      setSkills(data.skills);
    };
    getMySkills();
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      <SectionHeading kicker="what i work with" title="SKI" accent="LLS" />

      {isDesktop ? (
        <Suspense
          fallback={
            <div className="w-full h-[420px] sm:h-[480px] lg:h-[560px] rounded-2xl border border-border bg-card/30 animate-pulse" />
          }
        >
          <SkillsOrbit items={skills} />
        </Suspense>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {skills &&
            skills.map((element, i) => (
              <Reveal key={element?._id} delay={(i % 10) * 0.03}>
                <IconCard iconUrl={element?.svg?.url} title={element?.title} />
              </Reveal>
            ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
