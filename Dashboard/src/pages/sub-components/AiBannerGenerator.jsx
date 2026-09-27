import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Sparkles, Wand2, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileDropzone from "@/components/FileDropzone";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const dataUrlToFile = async (dataUrl, filename) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

// Generates a minimalistic project banner from the title/description (and an
// optional reference screenshot) via the backend's Gemini-powered endpoint.
const AiBannerGenerator = ({ title, description, technologies, onBannerGenerated }) => {
  const [open, setOpen] = useState(false);
  const [styleNotes, setStyleNotes] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [referencePreview, setReferencePreview] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState("");

  const handleReferenceChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setReferencePreview(reader.result);
      setReferenceImage(file);
    };
  };

  const handleGenerate = async () => {
    if (!title || !title.trim()) {
      toast.error("Add a project title first so the AI has something to work with.");
      return;
    }
    setGenerating(true);
    setGeneratedPreview("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description || "");
      formData.append("technologies", technologies || "");
      formData.append("styleNotes", styleNotes);
      if (referenceImage) formData.append("referenceImage", referenceImage);

      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/ai/generate-banner`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const dataUrl = `data:${data.image.mimeType};base64,${data.image.data}`;
      setGeneratedPreview(dataUrl);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate banner with AI."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleUseBanner = async () => {
    const file = await dataUrlToFile(generatedPreview, "ai-banner.png");
    onBannerGenerated(file, generatedPreview);
    toast.success("AI banner applied — remember to save the project.");
  };

  return (
    <div className="mt-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((v) => !v)}
        className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
      >
        <Sparkles className="w-4 h-4" />
        {open ? "Close AI Banner Generator" : "Generate Banner with AI"}
      </Button>

      {open && (
        <div className="terminal-window mt-3">
          <div className="terminal-window-bar">
            <span className="terminal-window-dot bg-[#ff5f56]" />
            <span className="terminal-window-dot bg-[#ffbd2e]" />
            <span className="terminal-window-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              ai-banner-generator
            </span>
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-4">
            <p className="font-mono text-xs text-muted-foreground">
              Uses the title, description &amp; technologies above as the prompt.
              Optionally add style notes or a reference screenshot of the real
              site/app for inspiration.
            </p>

            <div>
              <Label className="font-mono text-sm text-muted-foreground">
                Extra style notes (optional)
              </Label>
              <Textarea
                className="mt-2"
                placeholder="e.g. dark theme, purple accents, isometric illustration"
                value={styleNotes}
                onChange={(e) => setStyleNotes(e.target.value)}
              />
            </div>

            <div>
              <Label className="font-mono text-sm text-muted-foreground">
                Reference image (optional)
              </Label>
              <div className="mt-2">
                <FileDropzone
                  id="ai-banner-reference"
                  preview={referencePreview}
                  onChange={handleReferenceChange}
                  label="Upload a screenshot"
                  hint="Your site/app screenshot for style reference"
                  previewClassName="mx-auto h-[140px] w-full object-contain"
                  accept="image/*"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="gap-2 w-fit"
            >
              <Wand2 className="w-4 h-4" />
              {generating ? "Generating..." : "Generate"}
            </Button>

            {generatedPreview && (
              <div className="flex flex-col gap-3">
                <img
                  src={generatedPreview}
                  alt="AI generated banner"
                  className="w-full h-[220px] object-cover rounded-md border border-border"
                />
                <div className="flex gap-3">
                  <Button type="button" onClick={handleUseBanner} className="gap-2">
                    <Check className="w-4 h-4" />
                    Use this banner
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={generating}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiBannerGenerator;
