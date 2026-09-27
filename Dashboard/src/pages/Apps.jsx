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
  addNewSoftwareApplication,
  clearAllSoftwareAppErrors,
  deleteSoftwareApplication,
  getAllSoftwareApplications,
  resetSoftwareApplicationSlice,
} from "@/store/slices/softwareApplicationSlice";

const Apps = () => {
  const { loading, softwareApplications, error, message } = useSelector(
    (state) => state.softwareApplications
  );
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [svg, setSvg] = useState("");
  const [svgPreview, setSvgPreview] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleSvg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSvgPreview(reader.result);
      setSvg(file);
    };
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("svg", svg);
    dispatch(addNewSoftwareApplication(formData));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(deleteSoftwareApplication(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllSoftwareAppErrors());
    }
    if (message) {
      toast.success(message);
      setName("");
      setSvg("");
      setSvgPreview("");
      setDeletingId(null);
      dispatch(resetSoftwareApplicationSlice());
      dispatch(getAllSoftwareApplications());
    }
  }, [dispatch, loading, error, message]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-mono text-2xl font-bold">
        Manage <span className="text-gradient">Apps</span>
      </h1>

      <form onSubmit={handleAdd} className="terminal-window">
        <div className="terminal-window-bar">
          <span className="terminal-window-dot bg-[#ff5f56]" />
          <span className="terminal-window-dot bg-[#ffbd2e]" />
          <span className="terminal-window-dot bg-[#27c93f]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">add-app.jsx</span>
        </div>
        <div className="p-5 sm:p-6 flex flex-col gap-5 max-w-xl">
          <div>
            <Label className="font-mono text-sm">Application Name</Label>
            <Input
              className="mt-2"
              placeholder="Android Studio"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label className="font-mono text-sm">Icon</Label>
            <div className="mt-2">
              <FileDropzone
                id="app-icon-upload"
                preview={svgPreview}
                onChange={handleSvg}
                previewClassName="mx-auto h-16 w-16 object-contain"
              />
            </div>
          </div>
          {loading && !deletingId ? (
            <SpecialLoadingButton content="Adding Application" />
          ) : (
            <Button type="submit">Add Application</Button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-mono text-lg font-semibold mb-4 text-muted-foreground">
          Existing Apps ({softwareApplications?.length || 0})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {softwareApplications && softwareApplications.length > 0 ? (
            softwareApplications.map((element) => (
              <div
                key={element._id}
                className="terminal-window p-4 flex flex-col items-center gap-3"
              >
                <img src={element.svg?.url} alt={element.name} className="w-10 h-10 object-contain" />
                <span className="font-mono text-sm text-center">{element.name}</span>
                {loading && deletingId === element._id ? (
                  <SpecialLoadingButton content="Deleting" width="w-full" />
                ) : (
                  <button
                    onClick={() => handleDelete(element._id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground font-mono text-sm">
              You have not added any application yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apps;
