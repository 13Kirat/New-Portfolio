import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import {
  clearAllProjectErrors,
  getAllProjects,
  resetProjectSlice,
  updateProject,
} from "@/store/slices/projectSlice";
import ProjectForm from "./sub-components/ProjectForm";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const UpdateProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const { loading, error, message } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    const getProject = async () => {
      await axios
        .get(`${BACKEND_URL}/api/v1/project/get/${id}?includeHidden=true`, {
          withCredentials: true,
        })
        .then((res) => setProject(res.data.project))
        .catch((err) => toast.error(err.response?.data?.message || "Failed to load project."));
    };
    getProject();
  }, [id]);

  const handleSubmit = (formData) => {
    dispatch(updateProject(id, formData));
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
      navigateTo("/projects");
    }
  }, [dispatch, error, loading, message]);

  if (!project) {
    return <p className="font-mono text-muted-foreground">Loading project...</p>;
  }

  return (
    <div>
      <h1 className="font-mono text-2xl font-bold mb-6">
        <span className="text-gradient">Update</span> Project
      </h1>
      <ProjectForm mode="edit" initialProject={project} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default UpdateProject;
