import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import {
  addNewTimeline,
  clearAllTimelineErrors,
  deleteTimeline,
  getAllTimeline,
  resetTimelineSlice,
} from "@/store/slices/timelineSlice";

const Timeline = () => {
  const { loading, timeline, error, message } = useSelector((state) => state.timeline);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addNewTimeline({ title, description, from, to }));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(deleteTimeline(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllTimelineErrors());
    }
    if (message) {
      toast.success(message);
      setTitle("");
      setDescription("");
      setFrom("");
      setTo("");
      setDeletingId(null);
      dispatch(resetTimelineSlice());
      dispatch(getAllTimeline());
    }
  }, [dispatch, loading, error, message]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-mono text-2xl font-bold">
        Manage <span className="text-gradient">Timeline</span>
      </h1>

      <form onSubmit={handleAdd} className="terminal-window">
        <div className="terminal-window-bar">
          <span className="terminal-window-dot bg-[#ff5f56]" />
          <span className="terminal-window-dot bg-[#ffbd2e]" />
          <span className="terminal-window-dot bg-[#27c93f]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">add-timeline.jsx</span>
        </div>
        <div className="p-5 sm:p-6 flex flex-col gap-5 max-w-xl">
          <div>
            <Label className="font-mono text-sm">Title</Label>
            <Input
              className="mt-2"
              placeholder="Full Stack Developer at Acme Inc"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="font-mono text-sm">Description</Label>
            <Textarea
              className="mt-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-mono text-sm">From</Label>
              <Input
                className="mt-2"
                placeholder="March 2025"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div>
              <Label className="font-mono text-sm">To</Label>
              <Input
                className="mt-2"
                placeholder="Present"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
          {loading && !deletingId ? (
            <SpecialLoadingButton content="Adding New Timeline" />
          ) : (
            <Button type="submit">Add Timeline</Button>
          )}
        </div>
      </form>

      <div className="terminal-window flex flex-col divide-y divide-border">
        {timeline && timeline.length > 0 ? (
          timeline.map((element) => (
            <div key={element._id} className="p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono font-medium">{element.title}</p>
                <p className="font-mono text-xs text-primary/80 mt-0.5">
                  {element.timeline.from} — {element.timeline.to || "Present"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  {element.description}
                </p>
              </div>
              {loading && deletingId === element._id ? (
                <SpecialLoadingButton content="Deleting" width="w-28" />
              ) : (
                <button
                  onClick={() => handleDelete(element._id)}
                  className="shrink-0 border-2 border-destructive text-destructive rounded-full h-8 w-8 flex justify-center items-center hover:bg-destructive hover:text-white transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="p-4 text-muted-foreground font-mono text-sm">
            You have not added any timeline entry yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Timeline;
