import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const selectClass =
  "w-full border border-border rounded-md px-3 py-2 bg-card/60 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

const Portfolio = () => {
  const [viewAll, setViewAll] = useState(false);
  const [projects, setProjects] = useState([]);
  const [domainFilter, setDomainFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stackFilter, setStackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const domainOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.domain)
          .filter((value) => value && value.trim())
      ),
    ];
  }, [projects]);

  const categoryOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.category)
          .filter((value) => value && value.trim())
      ),
    ];
  }, [projects]);

  const stackOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.stack)
          .filter((value) => value && value.trim())
      ),
    ];
  }, [projects]);

  const statusOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.status)
          .filter((value) => value && value.trim())
      ),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return (projects || []).filter((project) => {
      const domain = (project?.domain || "").toLowerCase();
      const category = (project?.category || "").toLowerCase();
      const stack = (project?.stack || "").toLowerCase();
      const status = (project?.status || "").toLowerCase();

      const domainMatches = domainFilter === "all" || domain === domainFilter;
      const categoryMatches = categoryFilter === "all" || category === categoryFilter;
      const stackMatches = stackFilter === "all" || stack === stackFilter;
      const statusMatches = statusFilter === "all" || status === statusFilter;

      return domainMatches && categoryMatches && stackMatches && statusMatches;
    });
  }, [projects, domainFilter, categoryFilter, stackFilter, statusFilter]);

  const visibleProjects = viewAll ? filteredProjects : filteredProjects.slice(0, 9);

  useEffect(() => {
    const getMyProjects = async () => {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/project/getall`,
        { withCredentials: true }
      );
      setProjects(data.projects);
    };
    getMyProjects();
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      <SectionHeading kicker="things i've built" title="MY" accent="PROJECTS" />

      <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-mono mb-2 text-muted-foreground">domain</label>
          <select
            className={selectClass}
            value={domainFilter}
            onChange={(e) => {
              setDomainFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option value="all">All Domains</option>
            {domainOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono mb-2 text-muted-foreground">category</label>
          <select
            className={selectClass}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono mb-2 text-muted-foreground">stack</label>
          <select
            className={selectClass}
            value={stackFilter}
            onChange={(e) => {
              setStackFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option value="all">All Stacks</option>
            {stackOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono mb-2 text-muted-foreground">status</label>
          <select
            className={selectClass}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleProjects.map((element, i) => (
          <Reveal key={element?._id} delay={(i % 9) * 0.05}>
            <Link
              to={`/project/${element?._id}`}
              className="group glow-border relative block rounded-xl overflow-hidden border border-border bg-card/50 aspect-[16/10]"
            >
              <img
                src={element?.projectBanner?.url}
                alt={element?.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
                <h3 className="font-mono font-semibold text-sm sm:text-base text-foreground">
                  {element?.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(element?.technologies || "")
                    .split(",")
                    .slice(0, 3)
                    .map((tech) => tech.trim())
                    .filter(Boolean)
                    .map((tech) => (
                      <span
                        key={tech}
                        className="text-[0.65rem] font-mono px-2 py-0.5 rounded-full border border-primary/30 text-primary/90 bg-primary/5"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
                <span className="flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Project <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {filteredProjects && filteredProjects.length > 9 && (
        <div className="w-full text-center my-4">
          <Button className="w-52" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
