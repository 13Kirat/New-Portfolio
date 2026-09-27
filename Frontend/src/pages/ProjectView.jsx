import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Badge = ({ children }) => (
  <span className="text-xs font-mono px-3 py-1 rounded-full border border-primary/30 text-primary/90 bg-primary/5">
    {children}
  </span>
);

const ProjectView = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [domain, setDomain] = useState("");
  const [category, setCategory] = useState("");
  const [stack, setStack] = useState("");
  const [status, setStatus] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getProject = async () => {
      await axios
        .get(`${BACKEND_URL}/api/v1/project/get/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setTitle(res.data.project.title);
          setDescription(res.data.project.description);
          setDomain(res.data.project.domain || "");
          setCategory(res.data.project.category || "");
          setStack(res.data.project.stack || "");
          setStatus(res.data.project.status || "");
          setTechnologies(res.data.project.technologies);
          setGitRepoLink(res.data.project.gitRepoLink);
          setProjectLink(res.data.project.projectLink);
          setProjectBannerPreview(
            res.data.project.projectBanner && res.data.project.projectBanner.url
          );
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    };
    getProject();
  }, [id]);

  const descriptionList = description.split(". ").filter(Boolean);
  const technologiesList = technologies.split(", ").filter(Boolean);

  const navigateTo = useNavigate();
  const handleReturnToPortfolio = () => {
    navigateTo("/");
  };

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="max-w-[900px] mx-auto px-5">
        <Button variant="outline" onClick={handleReturnToPortfolio} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Return to Portfolio
        </Button>

        <div className="relative rounded-xl overflow-hidden border border-border mb-8 aspect-[16/9] bg-card">
          <img
            src={projectBannerPreview || "/avatarHolder.jpg"}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <h1 className="absolute bottom-4 left-5 right-5 font-mono text-xl sm:text-3xl font-bold">
            {title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {domain && <Badge>{domain}</Badge>}
          {category && <Badge>{category}</Badge>}
          {stack && <Badge>{stack}</Badge>}
          {status && <Badge>{status}</Badge>}
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <p className="font-mono text-sm text-primary mb-3">// description</p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              {descriptionList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-sm text-primary mb-3">// technologies</p>
            <div className="flex flex-wrap gap-2">
              {technologiesList.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {gitRepoLink && (
              <Link to={gitRepoLink} target="_blank">
                <Button variant="outline" className="gap-2">
                  <Github className="w-4 h-4" />
                  Repository
                </Button>
              </Link>
            )}
            {projectLink && (
              <Link to={projectLink} target="_blank">
                <Button className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Live Project
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
