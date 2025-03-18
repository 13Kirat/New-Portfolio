import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import ManageSkills from './pages/ManageSkills';
import ManageTimeline from './pages/ManageTimeline';
import ManageProjects from './pages/ManageProjects';
import ViewProject from './pages/ViewProject';
import UpdateProject from './pages/UpdateProject';
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { useDispatch } from 'react-redux';
import { getUser } from './store/slices/userSlice';
import { getAllSkills } from './store/slices/skillSlice';
import { getAllSoftwareApplications } from './store/slices/softwareApplicationSlice';
import { getAllTimeline } from './store/slices/timelineSlice';
import { getAllMessages } from './store/slices/messageSlice';
import { getAllProjects } from './store/slices/projectSlice';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllSkills());
    dispatch(getAllSoftwareApplications());
    dispatch(getAllTimeline());
    dispatch(getAllMessages());
    dispatch(getAllProjects());
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgetPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/manage/skills" element={<ManageSkills />} />
        <Route path="/manage/timeline" element={<ManageTimeline />} />
        <Route path="/manage/projects" element={<ManageProjects />} />
        <Route path="/view/project/:id" element={<ViewProject />} />
        <Route path="/update/project/:id" element={<UpdateProject />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  )
}
