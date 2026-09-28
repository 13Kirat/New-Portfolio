import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FileDropzone from "@/components/FileDropzone";
import SpecialLoadingButton from "./SpecialLoadingButton";
import AiBannerGenerator from "./AiBannerGenerator";

const CUSTOM_DOMAIN_VALUE = "__CUSTOM_DOMAIN__";
const CUSTOM_CATEGORY_VALUE = "__CUSTOM_CATEGORY__";
const CUSTOM_STACK_VALUE = "__CUSTOM_STACK__";
const CUSTOM_STATUS_VALUE = "__CUSTOM_STATUS__";
const CUSTOM_PROJECT_TYPE_VALUE = "__CUSTOM_PROJECT_TYPE__";

const fieldLabelClass = "block text-sm font-medium leading-6 text-foreground font-mono";

const uniqueValues = (projects, key, customValue) => [
  ...new Set(
    (projects || [])
      .map((project) => project?.[key])
      .filter((value) => value && value.trim() && value !== customValue)
  ),
];

// Shared form used by both the "add project" and "edit project" pages, so the
// AI banner generator and every field only need to exist in one place.
const ProjectForm = ({ mode, initialProject, onSubmit, loading }) => {
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(initialProject?.title || "");
  const [description, setDescription] = useState(initialProject?.description || "");
  const [technologies, setTechnologies] = useState(initialProject?.technologies || "");
  const [domain, setDomain] = useState(initialProject?.domain || "");
  const [category, setCategory] = useState(initialProject?.category || "");
  const [projectType, setProjectType] = useState(initialProject?.projectType || "");
  const [stack, setStack] = useState(initialProject?.stack || "");
  const [status, setStatus] = useState(initialProject?.status || "");
  const [visible, setVisible] = useState(
    initialProject ? (initialProject.visible ? "true" : "false") : "true"
  );
  const [gitRepoLink, setGitRepoLink] = useState(initialProject?.gitRepoLink || "");
  const [projectLink, setProjectLink] = useState(initialProject?.projectLink || "");
  const [projectBanner, setProjectBanner] = useState(
    initialProject?.projectBanner?.url || ""
  );
  const [projectBannerPreview, setProjectBannerPreview] = useState(
    initialProject?.projectBanner?.url || ""
  );
  const [customDomain, setCustomDomain] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customProjectType, setCustomProjectType] = useState("");
  const [customStack, setCustomStack] = useState("");
  const [customStatus, setCustomStatus] = useState("");

  const { projects } = useSelector((state) => state.project);

  const domainOptions = useMemo(
    () => uniqueValues(projects, "domain", CUSTOM_DOMAIN_VALUE),
    [projects]
  );
  const categoryOptions = useMemo(
    () => uniqueValues(projects, "category", CUSTOM_CATEGORY_VALUE),
    [projects]
  );
  const stackOptions = useMemo(
    () => uniqueValues(projects, "stack", CUSTOM_STACK_VALUE),
    [projects]
  );
  const statusOptions = useMemo(
    () => uniqueValues(projects, "status", CUSTOM_STATUS_VALUE),
    [projects]
  );

  const handleBannerFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProjectBannerPreview(reader.result);
      setProjectBanner(file);
    };
  };

  const handleBannerInputChange = (e) => handleBannerFile(e.target.files[0]);

  const handleAiBannerGenerated = (file, previewDataUrl) => {
    setProjectBanner(file);
    setProjectBannerPreview(previewDataUrl);
  };

  const navigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDomain = domain === CUSTOM_DOMAIN_VALUE ? customDomain.trim() : domain.trim();
    const finalCategory =
      category === CUSTOM_CATEGORY_VALUE ? customCategory.trim() : category.trim();
    const finalStack = stack === CUSTOM_STACK_VALUE ? customStack.trim() : stack.trim();
    const finalStatus = status === CUSTOM_STATUS_VALUE ? customStatus.trim() : status.trim();
    const finalProjectType =
      projectType === CUSTOM_PROJECT_TYPE_VALUE ? customProjectType.trim() : projectType.trim();

    if (!finalDomain || !finalCategory || !finalStack || !finalStatus) {
      toast.error("Please fill domain, category, stack and status.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("domain", finalDomain);
    formData.append("category", finalCategory);
    formData.append("projectType", finalProjectType);
    formData.append("gitRepoLink", gitRepoLink);
    formData.append("projectLink", projectLink);
    formData.append("technologies", technologies);
    formData.append("stack", finalStack);
    formData.append("status", finalStatus);
    formData.append("visible", visible);
    formData.append("projectBanner", projectBanner);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[900px] mx-auto flex flex-col gap-8">
      <div className="terminal-window">
        <div className="terminal-window-bar">
          <span className="terminal-window-dot bg-[#ff5f56]" />
          <span className="terminal-window-dot bg-[#ffbd2e]" />
          <span className="terminal-window-dot bg-[#27c93f]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            {isEdit ? "update-project.jsx" : "new-project.jsx"}
          </span>
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-6">
          <div>
            <Label className={fieldLabelClass}>Project Title</Label>
            <Input
              className="mt-2"
              placeholder="MERN STACK PORTFOLIO"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label className={fieldLabelClass}>Description</Label>
            <Textarea
              className="mt-2"
              placeholder="Feature 1. Feature 2. Feature 3."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label className={fieldLabelClass}>Technologies Used</Label>
            <Textarea
              className="mt-2"
              placeholder="HTML, CSS, JAVASCRIPT, REACT"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label className={fieldLabelClass}>Domain</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Project Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_DOMAIN_VALUE}>+ Add New Domain</SelectItem>
                </SelectContent>
              </Select>
              {domain === CUSTOM_DOMAIN_VALUE && (
                <Input
                  className="mt-2"
                  placeholder="Enter new domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
              )}
            </div>

            <div>
              <Label className={fieldLabelClass}>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Project Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_CATEGORY_VALUE}>+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
              {category === CUSTOM_CATEGORY_VALUE && (
                <Input
                  className="mt-2"
                  placeholder="Enter new category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              )}
            </div>

            <div>
              <Label className={fieldLabelClass}>Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Freelance / Internship / Personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Personal Project">Personal Project</SelectItem>
                  <SelectItem value={CUSTOM_PROJECT_TYPE_VALUE}>+ Add New</SelectItem>
                </SelectContent>
              </Select>
              {projectType === CUSTOM_PROJECT_TYPE_VALUE && (
                <Input
                  className="mt-2"
                  placeholder="Enter project type"
                  value={customProjectType}
                  onChange={(e) => setCustomProjectType(e.target.value)}
                />
              )}
            </div>

            <div>
              <Label className={fieldLabelClass}>Stack</Label>
              <Select value={stack} onValueChange={setStack}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Project Stack" />
                </SelectTrigger>
                <SelectContent>
                  {stackOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_STACK_VALUE}>+ Add New Stack</SelectItem>
                </SelectContent>
              </Select>
              {stack === CUSTOM_STACK_VALUE && (
                <Input
                  className="mt-2"
                  placeholder="Enter new stack"
                  value={customStack}
                  onChange={(e) => setCustomStack(e.target.value)}
                />
              )}
            </div>

            <div>
              <Label className={fieldLabelClass}>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Project Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_STATUS_VALUE}>+ Add New Status</SelectItem>
                </SelectContent>
              </Select>
              {status === CUSTOM_STATUS_VALUE && (
                <Input
                  className="mt-2"
                  placeholder="Enter new status"
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                />
              )}
            </div>
          </div>

          <div>
            <Label className={fieldLabelClass}>Project Visibility</Label>
            <Select value={visible} onValueChange={setVisible}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select Project Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Visible (Publicly shown on Portfolio)</SelectItem>
                <SelectItem value="false">Hidden (Draft/Internal Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label className={fieldLabelClass}>Github Repository Link</Label>
              <div className="relative mt-2">
                <LinkIcon className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Github Repository Link"
                  value={gitRepoLink}
                  onChange={(e) => setGitRepoLink(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className={fieldLabelClass}>Project Link</Label>
              <div className="relative mt-2">
                <LinkIcon className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Live Project Link"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Label className={fieldLabelClass}>Project Banner</Label>
            <div className="mt-2">
              <FileDropzone
                id="project-banner-upload"
                preview={projectBannerPreview}
                onChange={handleBannerInputChange}
                previewClassName="mx-auto h-[220px] w-full object-cover rounded-md"
              />
            </div>
            <AiBannerGenerator
              title={title}
              description={description}
              technologies={technologies}
              onBannerGenerated={handleAiBannerGenerated}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigateTo("/projects")}>
          Cancel
        </Button>
        {loading ? (
          <SpecialLoadingButton
            content={isEdit ? "Updating" : "Adding New Project"}
            width="w-56"
          />
        ) : (
          <Button type="submit" className="w-56">
            {isEdit ? "Update Project" : "Add Project"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
