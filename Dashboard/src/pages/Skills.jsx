import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileDropzone from "@/components/FileDropzone";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import {
  addNewSkill,
  clearAllSkillErrors,
  deleteSkill,
  getAllSkills,
  resetSkillSlice,
  updateSkill,
} from "@/store/slices/skillSlice";

const Skills = () => {
  const { loading, skills, error, message } = useSelector((state) => state.skill);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [svg, setSvg] = useState("");
  const [svgPreview, setSvgPreview] = useState("");
  const [pendingProficiency, setPendingProficiency] = useState({});

  const handleSvg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSvgPreview(reader.result);
      setSvg(file);
    };
  };

  const handleAddNewSkill = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("proficiency", proficiency);
    formData.append("svg", svg);
    dispatch(addNewSkill(formData));
  };

  const handleUpdateSkill = (id) => {
    const value = pendingProficiency[id];
    if (value === undefined) return;
    dispatch(updateSkill(id, value));
  };

  const handleDeleteSkill = (id) => {
    dispatch(deleteSkill(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllSkillErrors());
    }
    if (message) {
      toast.success(message);
      setTitle("");
      setProficiency("");
      setSvg("");
      setSvgPreview("");
      dispatch(resetSkillSlice());
      dispatch(getAllSkills());
    }
  }, [dispatch, loading, error, message]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-mono text-2xl font-bold">
        Manage <span className="text-gradient">Skills</span>
      </h1>

      <form onSubmit={handleAddNewSkill} className="terminal-window">
        <div className="terminal-window-bar">
          <span className="terminal-window-dot bg-[#ff5f56]" />
          <span className="terminal-window-dot bg-[#ffbd2e]" />
          <span className="terminal-window-dot bg-[#27c93f]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">add-skill.jsx</span>
        </div>
        <div className="p-5 sm:p-6 flex flex-col gap-5 max-w-xl">
          <div>
            <Label className="font-mono text-sm">Title</Label>
            <Input
              className="mt-2"
              placeholder="React.JS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="font-mono text-sm">Proficiency</Label>
            <Input
              type="number"
              className="mt-2"
              placeholder="70"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
            />
          </div>
          <div>
            <Label className="font-mono text-sm">Icon</Label>
            <div className="mt-2">
              <FileDropzone
                id="skill-icon-upload"
                preview={svgPreview}
                onChange={handleSvg}
                previewClassName="mx-auto h-16 w-16 object-contain"
              />
            </div>
          </div>
          {loading ? (
            <SpecialLoadingButton content="Adding New Skill" />
          ) : (
            <Button type="submit">Add Skill</Button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-mono text-lg font-semibold mb-4 text-muted-foreground">
          Existing Skills ({skills?.length || 0})
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills && skills.length > 0 ? (
            skills.map((element) => (
              <div key={element._id} className="terminal-window p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={element.svg?.url} alt={element.title} className="w-8 h-8 object-contain" />
                    <span className="font-mono font-medium">{element.title}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(element._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="font-mono text-xs text-muted-foreground shrink-0">
                    Proficiency
                  </Label>
                  <Input
                    type="number"
                    defaultValue={element.proficiency}
                    onChange={(e) =>
                      setPendingProficiency((prev) => ({ ...prev, [element._id]: e.target.value }))
                    }
                    onBlur={() => handleUpdateSkill(element._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground font-mono text-sm">
              You have not added any skill yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
