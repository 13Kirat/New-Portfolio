import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearAllProjectErrors } from "@/store/slices/projectSlice";
import { clearAllSkillErrors } from "@/store/slices/skillSlice";
import { clearAllSoftwareAppErrors } from "@/store/slices/softwareApplicationSlice";
import { clearAllTimelineErrors } from "@/store/slices/timelineSlice";

const Dashboard = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { skills, error: skillError } = useSelector((state) => state.skill);
  const { softwareApplications, error: appError } = useSelector(
    (state) => state.softwareApplications
  );
  const { timeline, error: timelineError } = useSelector((state) => state.timeline);
  const { projects, error: projectError } = useSelector((state) => state.project);

  useEffect(() => {
    if (skillError) {
      toast.error(skillError);
      dispatch(clearAllSkillErrors());
    }
    if (appError) {
      toast.error(appError);
      dispatch(clearAllSoftwareAppErrors());
    }
    if (projectError) {
      toast.error(projectError);
      dispatch(clearAllProjectErrors());
    }
    if (timelineError) {
      toast.error(timelineError);
      dispatch(clearAllTimelineErrors());
    }
  }, [dispatch, skillError, appError, projectError, timelineError]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="terminal-window sm:col-span-2 p-5 flex flex-col justify-between gap-4">
          <p className="text-muted-foreground text-balance">{user.aboutMe}</p>
          {user.portfolioURL && (
            <a href={user.portfolioURL} target="_blank" rel="noreferrer" className="w-fit">
              <Button>Visit Portfolio</Button>
            </a>
          )}
        </div>
        <div className="terminal-window p-5 flex flex-col justify-center gap-2">
          <p className="font-mono text-sm text-muted-foreground">Projects</p>
          <p className="font-mono text-5xl font-bold text-gradient">{projects?.length || 0}</p>
          <Button onClick={() => navigateTo("/projects")} className="w-fit mt-2">
            Manage Projects
          </Button>
        </div>
        <div className="terminal-window p-5 flex flex-col justify-center gap-2">
          <p className="font-mono text-sm text-muted-foreground">Skills</p>
          <p className="font-mono text-5xl font-bold text-gradient">{skills?.length || 0}</p>
          <Button onClick={() => navigateTo("/skills")} className="w-fit mt-2">
            Manage Skills
          </Button>
        </div>
      </div>

      <div className="terminal-window">
        <div className="terminal-window-bar">
          <span className="terminal-window-dot bg-[#ff5f56]" />
          <span className="terminal-window-dot bg-[#ffbd2e]" />
          <span className="terminal-window-dot bg-[#27c93f]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">projects</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Stack</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((element) => (
                  <TableRow key={element._id}>
                    <TableCell className="font-mono font-medium">{element.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {element.stack}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{element.status || "-"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/projects/${element._id}/edit`}>
                        <Button size="sm">Update</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    You have not added any project.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="terminal-window">
          <div className="terminal-window-bar">
            <span className="terminal-window-dot bg-[#ff5f56]" />
            <span className="terminal-window-dot bg-[#ffbd2e]" />
            <span className="terminal-window-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">apps</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {softwareApplications && softwareApplications.length > 0 ? (
                  softwareApplications.map((element) => (
                    <TableRow key={element._id}>
                      <TableCell className="font-mono">{element.name}</TableCell>
                      <TableCell>
                        <img className="w-6 h-6" src={element.svg?.url} alt={element.name} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      No applications added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="terminal-window">
          <div className="terminal-window-bar justify-between">
            <div className="flex items-center gap-2">
              <span className="terminal-window-dot bg-[#ff5f56]" />
              <span className="terminal-window-dot bg-[#ffbd2e]" />
              <span className="terminal-window-dot bg-[#27c93f]" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">timeline</span>
            </div>
            <Button size="sm" onClick={() => navigateTo("/timeline")} className="mr-2">
              Manage
            </Button>
          </div>
          <div className="p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead className="text-right">To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeline && timeline.length > 0 ? (
                  timeline.map((element) => (
                    <TableRow key={element._id}>
                      <TableCell className="font-mono">{element.title}</TableCell>
                      <TableCell className="text-muted-foreground">{element.timeline.from}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {element.timeline.to || "Present"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No timeline entries yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
