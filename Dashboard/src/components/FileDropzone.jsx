import { ImageUp } from "lucide-react";

// Shared file-upload dropzone used for banners/svgs/avatars across the forms.
const FileDropzone = ({
  id,
  preview,
  onChange,
  label = "Upload a file",
  hint = "PNG, JPG, GIF up to 10MB",
  previewClassName = "mx-auto h-[220px] w-full object-contain",
  accept,
}) => {
  return (
    <div className="glow-border flex justify-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-8">
      <div className="text-center w-full">
        {preview ? (
          <img src={preview} alt="preview" className={previewClassName} />
        ) : (
          <ImageUp className="mx-auto h-10 w-10 text-muted-foreground" />
        )}

        <div className="mt-4 flex justify-center text-sm leading-6 text-muted-foreground font-mono">
          <label
            htmlFor={id}
            className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
          >
            <span>{label}</span>
            <input
              id={id}
              name={id}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={onChange}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs leading-5 text-muted-foreground/70 mt-1">{hint}</p>
      </div>
    </div>
  );
};

export default FileDropzone;
