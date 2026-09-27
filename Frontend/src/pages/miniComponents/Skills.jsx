import axios from "axios";
import React, { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import IconCard from "@/components/IconCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Skills = () => {
  const [skills, setSkills] = useState([]);
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills &&
          skills.map((element, i) => (
            <Reveal key={element?._id} delay={(i % 10) * 0.03}>
              <IconCard
                iconUrl={element?.svg?.url}
                title={element?.title}
                proficiency={element?.proficiency}
              />
            </Reveal>
          ))}
      </div>
    </div>
  );
};

export default Skills;
