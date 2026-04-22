import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import ResumeModal from "./ResumeModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
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
      url: `${BACKEND_URL}/api/v1/user/me/resume/view/${resume._id || "legacy-resume"}`,
      name: resume.name || "Resume"
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full h-full">
        <div>
          <div className="grid w-[100%] gap-6">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-balance text-muted-foreground">
                Full Profile Preview
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-start lg:justify-between lg:items-center flex-col lg:flex-row gap-5">
                <div className="grid gap-2 w-full sm:w-72">
                  <Label>Profile Image</Label>
                  <img
                    src={user && user.avatar && user.avatar.url}
                    alt="avatar"
                    className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl"
                  />
                </div>
                <div className="grid gap-2 w-full sm:w-72">
                  <Label>Resumes</Label>
                  <div className="space-y-2">
                    {resumes.map((resume, index) => (
                      <span
                        key={`${resume.url}-${index}`}
                        onClick={() => handleOpenResume(resume)}
                        className="text-sky-700 underline block cursor-pointer"
                      >
                        {resume.name || `Resume ${index + 1}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input type="text" defaultValue={user.fullName} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={user.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input type="text" defaultValue={user.phone} disabled />
              </div>
              <div className="grid gap-2">
                <Label>About Me</Label>
                <Textarea defaultValue={user.aboutMe} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Portfolio URL</Label>
                <Input type="text" defaultValue={user.portfolioURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Github URL</Label>
                <Input type="text" defaultValue={user.githubURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>LinkedIn URL</Label>
                <Input type="text" defaultValue={user.linkedInURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Instagram URL</Label>
                <Input type="text" defaultValue={user.instagramURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Twitter(X) URL</Label>
                <Input type="text" defaultValue={user.twitterURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Facebook URL</Label>
                <Input type="text" defaultValue={user.facebookURL} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeUrl={selectedResume?.url}
        resumeName={selectedResume?.name}
      />
    </>
  );
};

export default Profile;
