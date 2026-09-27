import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addNewProject,
  clearAllProjectErrors,
  getAllProjects,
  resetProjectSlice,
} from "@/store/slices/projectSlice";
import ProjectForm from "./ProjectForm";

const AddProject = () => {
  const { loading, error, message } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleSubmit = (formData) => {
    dispatch(addNewProject(formData));
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

  return (
    <div>
      <h1 className="font-mono text-2xl font-bold mb-6">
        <span className="text-gradient">Add</span> New Project
      </h1>
      <ProjectForm mode="add" onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddProject;
