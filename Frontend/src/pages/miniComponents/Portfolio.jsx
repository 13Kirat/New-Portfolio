import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Portfolio = () => {
  const optionClassName =
    "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100";

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

  const finalDomainFilter = domainFilter;
  const finalCategoryFilter = categoryFilter;
  const finalStackFilter = stackFilter;
  const finalStatusFilter = statusFilter;

  const filteredProjects = useMemo(() => {
    return (projects || []).filter((project) => {
      const domain = (project?.domain || "").toLowerCase();
      const category = (project?.category || "").toLowerCase();
      const stack = (project?.stack || "").toLowerCase();
      const status = (project?.status || "").toLowerCase();

      const domainMatches =
        finalDomainFilter === "all" || domain === finalDomainFilter;
      const categoryMatches =
        finalCategoryFilter === "all" || category === finalCategoryFilter;

      const stackMatches =
        finalStackFilter === "all" || stack === finalStackFilter;
      const statusMatches =
        finalStatusFilter === "all" || status === finalStatusFilter;

      return domainMatches && categoryMatches && stackMatches && statusMatches;
    });
  }, [
    projects,
    finalDomainFilter,
    finalCategoryFilter,
    finalStackFilter,
    finalStatusFilter,
  ]);

  const visibleProjects = viewAll
    ? filteredProjects
    : filteredProjects.slice(0, 9);

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
    <div>
      <div className="relative mb-12">
        <h1
          className="hidden sm:flex gap-4 items-center text-[2rem] sm:text-[2.75rem] md:text-[3rem] 
          lg:text-[3.8rem] leading-[56px] md:leading-[67px] lg:leading-[90px] tracking-[15px] 
          mx-auto w-fit font-extrabold about-h1"
          style={{
            background: "hsl(222.2 84% 4.9%)",
          }}
        >
          MY{" "}
          <span className="text-tubeLight-effect font-extrabold">
            PROJECTS
          </span>
        </h1>
        <h1
          className="flex sm:hidden gap-4 items-center text-[2rem] sm:text-[2.75rem] 
          md:text-[3rem] lg:text-[3.8rem] leading-[56px] md:leading-[67px] lg:leading-[90px] 
          tracking-[15px] mx-auto w-fit font-extrabold about-h1"
          style={{
            background: "hsl(222.2 84% 4.9%)",
          }}
        >
          MY <span className="text-tubeLight-effect font-extrabold">WORK</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200"></span>
      </div>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-2">Filter By Domain</label>
          <select
            className="w-full border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={domainFilter}
            onChange={(e) => {
              setDomainFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option className={optionClassName} value="all">
              All Domains
            </option>
            {domainOptions.map((option) => (
              <option
                className={optionClassName}
                key={option}
                value={option.toLowerCase()}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2">Filter By Category</label>
          <select
            className="w-full border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option className={optionClassName} value="all">
              All Categories
            </option>
            {categoryOptions.map((option) => (
              <option
                className={optionClassName}
                key={option}
                value={option.toLowerCase()}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2">Filter By Stack</label>
          <select
            className="w-full border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={stackFilter}
            onChange={(e) => {
              setStackFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option className={optionClassName} value="all">
              All Stacks
            </option>
            {stackOptions.map((option) => (
              <option
                className={optionClassName}
                key={option}
                value={option.toLowerCase()}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2">Filter By Status</label>
          <select
            className="w-full border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setViewAll(false);
            }}
          >
            <option className={optionClassName} value="all">
              All Statuses
            </option>
            {statusOptions.map((option) => (
              <option
                className={optionClassName}
                key={option}
                value={option.toLowerCase()}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleProjects.map((element) => {
          return (
            <Link to={`/project/${element?._id}`} key={element?._id}>
              <img
                src={element?.projectBanner && element?.projectBanner.url}
                alt={element?.title}
              />
            </Link>
          );
        })}
      </div>
      {filteredProjects && filteredProjects.length > 9 && (
        <div className="w-full text-center my-9">
          <Button className="w-52" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
