import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clearAllUserErrors,
  deleteResume,
  getUser,
  resetProfile,
  updateProfile,
} from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import SpecialLoadingButton from "./SpecialLoadingButton";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const UpdateProfile = () => {
  const { user, loading, error, isUpdated, message } = useSelector(
    (state) => state.user
  );

  const [fullName, setFullName] = useState(user && user.fullName);
  const [email, setEmail] = useState(user && user.email);
  const [phone, setPhone] = useState(user && user.phone);
  const [aboutMe, setAboutMe] = useState(user && user.aboutMe);
  const [portfolioURL, setPortfolioURL] = useState(user && user.portfolioURL);
  const [linkedInURL, setLinkedInURL] = useState(
    user && (user.linkedInURL === "undefined" ? "" : user.linkedInURL)
  );
  const [githubURL, setGithubURL] = useState(
    user && (user.githubURL === "undefined" ? "" : user.githubURL)
  );
  const [instagramURL, setInstagramURL] = useState(
    user && (user.instagramURL === "undefined" ? "" : user.instagramURL)
  );
  const [twitterURL, setTwitterURL] = useState(
    user && (user.twitterURL === "undefined" ? "" : user.twitterURL)
  );
  const [facebookURL, setFacebookURL] = useState(
    user && (user.facebookURL === "undefined" ? "" : user.facebookURL)
  );
  const [avatar, setAvatar] = useState(user && user.avatar && user.avatar.url);
  const [avatarPreview, setAvatarPreview] = useState(
    user && user.avatar && user.avatar.url
  );
  const [resumeEntries, setResumeEntries] = useState([
    { name: "", file: null, preview: "" },
  ]);

  const existingResumes =
    user?.resumes?.length > 0
      ? user.resumes
      : user?.resume?.url
        ? [{ _id: "legacy-resume", name: "Resume", url: user.resume.url }]
        : [];

  const handleDeleteResume = (resumeId) => {
    dispatch(deleteResume(resumeId));
  };

  const dispatch = useDispatch();

  const avatarHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
  };
  const addResumeEntry = () => {
    setResumeEntries((prev) => [...prev, { name: "", file: null, preview: "" }]);
  };

  const removeResumeEntry = (index) => {
    setResumeEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateResumeName = (index, value) => {
    setResumeEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, name: value } : entry))
    );
  };

  const updateResumeFile = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setResumeEntries((prev) =>
        prev.map((entry, i) =>
          i === index ? { ...entry, file, preview: reader.result } : entry
        )
      );
    };
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("aboutMe", aboutMe);
    formData.append("portfolioURL", portfolioURL);
    formData.append("linkedInURL", linkedInURL);
    formData.append("githubURL", githubURL);
    formData.append("instagramURL", instagramURL);
    formData.append("twitterURL", twitterURL);
    formData.append("facebookURL", facebookURL);
    formData.append("avatar", avatar);
    const validResumeEntries = resumeEntries.filter(
      (entry) => entry.file && entry.name.trim()
    );

    if (validResumeEntries.length > 0) {
      formData.append(
        "resumeNames",
        JSON.stringify(validResumeEntries.map((entry) => entry.name.trim()))
      );
      validResumeEntries.forEach((entry) => {
        formData.append("resumes", entry.file);
      });
    }
    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isUpdated) {
      dispatch(getUser());
      dispatch(resetProfile());
      setResumeEntries([{ name: "", file: null, preview: "" }]);
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, loading, error, isUpdated, message]);

  return (
    <>
      <div className="w-full h-full">
        <div>
          <div className="grid w-[100%] gap-6">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold">Update Profile</h1>
              <p className="text-balance text-muted-foreground">
                Update Your Profile Here
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-start lg:justify-between lg:items-center flex-col lg:flex-row gap-5">
                <div className="grid gap-2 w-full sm:w-72">
                  <Label>Profile Image</Label>
                  <img
                    src={avatarPreview ? avatarPreview : "/avatarHolder.jpg"}
                    alt="avatar"
                    className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      onChange={avatarHandler}
                      className="avatar-update-btn"
                    />
                  </div>
                </div>
                <div className="grid gap-2 w-full sm:w-72">
                  <Label>Resumes (PDF)</Label>
                  <div className="space-y-2">
                    {existingResumes.map((resume, index) => (
                      <div
                        key={`${resume.url}-${index}`}
                        className="flex items-center justify-between gap-2"
                      >
                        <a
                          href={`${BACKEND_URL}/api/v1/user/me/resume/view/${resume._id || "legacy-resume"
                            }`}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm text-primary underline font-mono"
                        >
                          {resume.name || `Resume ${index + 1}`}
                        </a>
                        {resume._id && (
                          <Button
                            type="button"
                            variant="destructive"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleDeleteResume(resume._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 mt-3">
                    {resumeEntries.map((entry, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <Input
                          type="text"
                          placeholder="Resume Name (e.g., Backend CV)"
                          value={entry.name}
                          onChange={(e) => updateResumeName(index, e.target.value)}
                        />
                        <Input
                          type="file"
                          accept="application/pdf"
                          className="mt-2"
                          onChange={(e) => updateResumeFile(index, e.target.files?.[0])}
                        />
                        {entry.preview && (
                          <p className="mt-2 text-xs text-muted-foreground">PDF selected</p>
                        )}
                        {resumeEntries.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={() => removeResumeEntry(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addResumeEntry}>
                      Add Another Resume
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  className="Your Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  className="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  type="text"
                  className="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>About Me</Label>
                <Textarea
                  className="About Me"
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Portfolio URL</Label>
                <Input
                  type="text"
                  className="Portfolio URL"
                  value={portfolioURL}
                  onChange={(e) => setPortfolioURL(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>LinkedIn URL</Label>
                <Input
                  type="text"
                  className="LinkedIn URL"
                  value={linkedInURL}
                  onChange={(e) => setLinkedInURL(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Github URL</Label>
                <Input
                  type="text"
                  className="Github URL"
                  value={githubURL}
                  onChange={(e) => setGithubURL(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Instagram URL</Label>
                <Input
                  type="text"
                  className="Instagram URL"
                  value={instagramURL}
                  onChange={(e) => setInstagramURL(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Twitter(X) URL</Label>
                <Input
                  type="text"
                  className="Twitter(X) URL"
                  value={twitterURL}
                  onChange={(e) => setTwitterURL(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Facebook URL</Label>
                <Input
                  type="text"
                  className="Facebook URL"
                  value={facebookURL}
                  onChange={(e) => setFacebookURL(e.target.value)}
                />
              </div>
              {!loading ? (
                <Button
                  onClick={() => handleUpdateProfile()}
                  className="w-full"
                >
                  Update Profile
                </Button>
              ) : (
                <SpecialLoadingButton content={"Updating"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
