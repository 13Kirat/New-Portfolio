import {
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  ChevronDown,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ResumeModal from "./ResumeModal";
import HeroCanvas from "@/components/three/HeroCanvas";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const socialIcons = [
  { key: "instagramURL", Icon: Instagram },
  { key: "facebookURL", Icon: Facebook },
  { key: "linkedInURL", Icon: Linkedin },
  { key: "twitterURL", Icon: Twitter },
];

const Hero = () => {
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const resumes =
    user?.resumes?.length > 0
      ? user.resumes
      : user?.resume?.url
        ? [{ _id: "legacy-resume", name: "Resume", url: user.resume.url }]
        : [];

  const handleOpenResume = (resume) => {
    setSelectedResume({
      url: `${BACKEND_URL}/api/v1/user/portfolio/resume/${resume._id || "legacy-resume"}`,
      name: resume.name || "Resume"
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const getMyProfile = async () => {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/user/portfolio/me`,
        { withCredentials: true }
      );
      setUser(data.user);
    };
    getMyProfile();
  }, []);

  return (
    <div className="relative -mt-24 sm:-mt-28 md:-mt-32 pt-32 sm:pt-40 pb-16 sm:pb-24 overflow-hidden min-h-[92vh] flex items-center">
      <div className="absolute inset-0 w-screen left-1/2 -translate-x-1/2 -z-10">
        <HeroCanvas />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2 mb-4 font-mono text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <p className="text-muted-foreground">[ available for work ]</p>
        </div>

        <p className="font-mono text-primary text-sm sm:text-base mb-2">
          <span className="text-muted-foreground">$</span> whoami
        </p>
        <h1 className="overflow-hidden text-[1.6rem] sm:text-[2.2rem] md:text-[2.8rem] lg:text-[3.4rem] font-extrabold tracking-tight mb-3 font-mono">
          Gurkirat Singh
        </h1>
        <h2 className="text-[1.1rem] sm:text-[1.4rem] md:text-[1.8rem] lg:text-[2.1rem] font-mono font-semibold tracking-wide mb-6">
          <span className="text-gradient">
            <Typewriter
              words={["FULL STACK DEVELOPER", "REACT NATIVE DEVELOPER", "FREELANCER"]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={65}
              deleteSpeed={40}
              delaySpeed={1400}
            />
          </span>
        </h2>

        <p className="font-mono text-sm sm:text-base text-muted-foreground max-w-2xl mb-8">
          <span className="tok-com">// {user?.aboutMe || "Building full stack apps, one deploy at a time."}</span>
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {user?.githubURL && (
            <Link to={user?.githubURL} target="_blank">
              <Button className="rounded-md gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </Link>
          )}
          {resumes.map((resume, index) => (
            <Button
              key={`${resume.url}-${index}`}
              variant="outline"
              onClick={() => handleOpenResume(resume)}
              className="rounded-md gap-2 border-primary/40 hover:bg-primary/10"
            >
              <ExternalLink className="w-4 h-4" />
              {resume.name || `Resume ${index + 1}`}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          {socialIcons.map(
            // eslint-disable-next-line no-unused-vars -- Icon used as JSX tag below
            ({ key, Icon }) =>
              user?.[key] && (
                <Link
                  key={key}
                  to={user[key]}
                  target="_blank"
                  className="glow-border flex items-center justify-center w-10 h-10 rounded-md border border-border bg-card/50 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              )
          )}
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-mono text-xs"
      >
        scroll
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>

      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeUrl={selectedResume?.url}
        resumeName={selectedResume?.name}
      />
    </div>
  );
};

export default Hero;
