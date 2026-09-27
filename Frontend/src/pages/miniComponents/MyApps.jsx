import axios from "axios";
import React, { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import IconCard from "@/components/IconCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const MyApps = () => {
  const [apps, setApps] = useState([]);
  useEffect(() => {
    const getMyApps = async () => {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/softwareapplication/getall`,
        { withCredentials: true }
      );
      setApps(data.softwareApplications);
    };
    getMyApps();
  }, []);

  if (!apps || apps.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-10">
      <SectionHeading kicker="tools of the trade" title="MY" accent="APPS" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {apps.map((element, i) => (
          <Reveal key={element?._id} delay={(i % 10) * 0.03}>
            <IconCard iconUrl={element?.svg?.url} title={element?.name} />
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default MyApps;
