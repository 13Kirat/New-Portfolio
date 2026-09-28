import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  clearAllProjectErrors,
  deleteProject,
  getAllProjects,
  resetProjectSlice,
} from "@/store/slices/projectSlice";
import { Eye, Pen, Plus, Trash2 } from "lucide-react";

const ICON_BUTTON_BASE =
  "border-2 rounded-full h-8 w-8 flex justify-center items-center transition-colors";
const ICON_BUTTON_VARIANTS = {
  primary: "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  accent: "border-accent text-accent hover:bg-accent hover:text-accent-foreground",
  destructive:
    "border-destructive text-destructive hover:bg-destructive hover:text-white",
};
const iconButtonClass = (variant) => `${ICON_BUTTON_BASE} ${ICON_BUTTON_VARIANTS[variant]}`;

const Projects = () => {
  const { projects, loading, error, message } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteProject(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllProjectErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetProjectSlice());
      dispatch(getAllProjects());
    }
  }, [dispatch, error, loading, message]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-mono text-2xl font-bold">
          Manage <span className="text-gradient">Projects</span>
        </h1>
        <Link to="/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <div className="terminal-window overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Stack</TableHead>
              <TableHead className="hidden md:table-cell">Domain</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects && projects.length > 0 ? (
              projects.map((element) => (
                <TableRow key={element._id}>
                  <TableCell>
                    <img
                      src={element.projectBanner?.url}
                      alt={element.title}
                      className="w-14 h-14 object-cover rounded-md border border-border"
                    />
                  </TableCell>
                  <TableCell className="font-medium font-mono">{element.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {element.stack}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {element.domain || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {element.projectType || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {element.status || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {element.visible ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <Link to={`/projects/${element._id}`} className={iconButtonClass("primary")}>
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to={`/projects/${element._id}/edit`} className={iconButtonClass("accent")}>
                        <Pen className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(element._id)}
                        className={iconButtonClass("destructive")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  You have not added any project yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Projects;
