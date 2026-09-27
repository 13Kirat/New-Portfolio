import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SpecialLoadingButton = ({ content, width }) => {
  return (
    <Button disabled type="button" className={`gap-2 ${width || "w-full"}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {content}...
    </Button>
  );
};

export default SpecialLoadingButton;
