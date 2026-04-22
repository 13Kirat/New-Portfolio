import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import {
  clearAllProjectErrors,
  getAllProjects,
  resetProjectSlice,
  updateProject,
} from "@/store/slices/projectSlice";
import { Button } from "@/components/ui/button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const UpdateProject = () => {
  const CUSTOM_DOMAIN_VALUE = "__CUSTOM_DOMAIN__";
  const CUSTOM_CATEGORY_VALUE = "__CUSTOM_CATEGORY__";
  const CUSTOM_STACK_VALUE = "__CUSTOM_STACK__";
  const CUSTOM_STATUS_VALUE = "__CUSTOM_STATUS__";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [status, setStatus] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [domain, setDomain] = useState("");
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customStack, setCustomStack] = useState("");
  const [customStatus, setCustomStatus] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");

  const { error, message, loading, projects } = useSelector(
    (state) => state.project
  );

  const domainOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.domain)
          .filter(
            (value) =>
              value &&
              value.trim() &&
              value !== CUSTOM_DOMAIN_VALUE
          )
      ),
    ];
  }, [projects]);

  const categoryOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.category)
          .filter(
            (value) =>
              value &&
              value.trim() &&
              value !== CUSTOM_CATEGORY_VALUE
          )
      ),
    ];
  }, [projects]);

  const stackOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.stack)
          .filter(
            (value) =>
              value &&
              value.trim() &&
              value !== CUSTOM_STACK_VALUE
          )
      ),
    ];
  }, [projects]);

  const statusOptions = useMemo(() => {
    return [
      ...new Set(
        (projects || [])
          .map((project) => project?.status)
          .filter(
            (value) =>
              value &&
              value.trim() &&
              value !== CUSTOM_STATUS_VALUE
          )
      ),
    ];
  }, [projects]);

  const dispatch = useDispatch();
  const { id } = useParams();

  const handleProjectBanner = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProjectBannerPreview(reader.result);
      setProjectBanner(file);
    };
  };

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
          setStack(res.data.project.stack);
          setStatus(res.data.project.status || "");
          setTechnologies(res.data.project.technologies);
          setGitRepoLink(res.data.project.gitRepoLink);
          setProjectLink(res.data.project.projectLink);
          setVisible(res.data.project.visible ? "true" : "false");
          setProjectBanner(
            res.data.project.projectBanner && res.data.project.projectBanner.url
          );
          setProjectBannerPreview(
            res.data.project.projectBanner && res.data.project.projectBanner.url
          );
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    };
    getProject();

    if (error) {
      toast.error(error);
      dispatch(clearAllProjectErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetProjectSlice());
      dispatch(getAllProjects());
    }
  }, [id, message, error]);

  const handleUpdateProject = (e) => {
    e.preventDefault();
    const finalDomain =
      domain === CUSTOM_DOMAIN_VALUE ? customDomain.trim() : domain.trim();
    const finalCategory =
      category === CUSTOM_CATEGORY_VALUE
        ? customCategory.trim()
        : category.trim();
    const finalStack =
      stack === CUSTOM_STACK_VALUE ? customStack.trim() : stack.trim();
    const finalStatus =
      status === CUSTOM_STATUS_VALUE ? customStatus.trim() : status.trim();

    if (!finalDomain || !finalCategory || !finalStack || !finalStatus) {
      toast.error("Please fill domain, category, stack and status.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("domain", finalDomain);
    formData.append("category", finalCategory);
    formData.append("stack", finalStack);
    formData.append("status", finalStatus);
    formData.append("technologies", technologies);
    formData.append("gitRepoLink", gitRepoLink);
    formData.append("projectLink", projectLink);
    formData.append("visible", visible);
    formData.append("projectBanner", projectBanner);
    dispatch(updateProject(id, formData));
  };

  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  return (
    <>
      <div className="flex mt-7 justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4">
        <form
          onSubmit={handleUpdateProject}
          className="w-[100%] px-5 md:w-[1000px] pb-5"
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex flex-col gap-2 items-start justify-between sm:items-center sm:flex-row">
                <h2 className="font-semibold leading-7 text-gray-900 text-3xl">
                  UPDATE PROJECT
                </h2>
                <Button onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </div>
              <div className="mt-10 flex flex-col gap-5">
                <div className="w-full sm:col-span-4">
                  <img
                    src={
                      projectBannerPreview
                        ? projectBannerPreview
                        : "/avatarHolder.jpg"
                    }
                    alt="projectBanner"
                    className="w-full h-auto"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleProjectBanner}
                      className="avatar-update-btn mt-4 w-full"
                    />
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Project Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="MERN STACK PORTFOLIO"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        placeholder="Feature 1. Feature 2. Feature 3."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Technologies Uses In This Project
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        placeholder="HTML, CSS, JAVASCRIPT, REACT"
                        value={technologies}
                        onChange={(e) => setTechnologies(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Domain
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select value={domain} onValueChange={setDomain}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project Domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {domainOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                          <SelectItem value={CUSTOM_DOMAIN_VALUE}>
                            + Add New Domain
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {domain === CUSTOM_DOMAIN_VALUE && (
                      <div className="mt-2">
                        <input
                          type="text"
                          className="block w-full border rounded-md bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600"
                          placeholder="Enter new domain"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Category
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                          <SelectItem value={CUSTOM_CATEGORY_VALUE}>
                            + Add New Category
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {category === CUSTOM_CATEGORY_VALUE && (
                      <div className="mt-2">
                        <input
                          type="text"
                          className="block w-full border rounded-md bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600"
                          placeholder="Enter new category"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Stack
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select value={stack} onValueChange={setStack}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project Stack" />
                        </SelectTrigger>
                        <SelectContent>
                          {stackOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                          <SelectItem value={CUSTOM_STACK_VALUE}>
                            + Add New Stack
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {stack === CUSTOM_STACK_VALUE && (
                      <div className="mt-2">
                        <input
                          type="text"
                          className="block w-full border rounded-md bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600"
                          placeholder="Enter new stack"
                          value={customStack}
                          onChange={(e) => setCustomStack(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Status
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                          <SelectItem value={CUSTOM_STATUS_VALUE}>
                            + Add New Status
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {status === CUSTOM_STATUS_VALUE && (
                      <div className="mt-2">
                        <input
                          type="text"
                          className="block w-full border rounded-md bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600"
                          placeholder="Enter new status"
                          value={customStatus}
                          onChange={(e) => setCustomStatus(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Project Visibility
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 bg-white">
                      <Select value={visible} onValueChange={setVisible}>
                        <SelectTrigger className="w-full px-3 py-2">
                          <SelectValue placeholder="Select Project Visibility" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="true">Visible (Publicly shown on Portfolio)</SelectItem>
                          <SelectItem value="false">Hidden (Draft/Internal Only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Github Repository Link
                  </label>
                  <div className="mt-2">
                    <div className="relative flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Github Repository Link"
                        value={gitRepoLink}
                        onChange={(e) => setGitRepoLink(e.target.value)}
                      />
                      <Link className="absolute w-5 h-5 left-1 top-2" />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Project Link
                  </label>
                  <div className="mt-2">
                    <div className="relative flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Github Repository Link"
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                      />
                      <Link className="absolute w-5 h-5 left-1 top-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            {loading ? (
              <SpecialLoadingButton content={"Updating"} width={"w-52"} />
            ) : (
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-52"
              >
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProject;
