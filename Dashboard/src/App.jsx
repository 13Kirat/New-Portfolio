import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import DashboardOverview from './pages/sub-components/Dashboard'
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Skills from './pages/Skills';
import Timeline from './pages/Timeline';
import Projects from './pages/Projects';
import Apps from './pages/Apps';
import ViewProject from './pages/ViewProject';
import AddProject from './pages/sub-components/AddProject';
import UpdateProject from './pages/UpdateProject';
import Messages from './pages/sub-components/Messages';
import Account from './pages/sub-components/Account';
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
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgetPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<AddProject />} />
          <Route path="/projects/:id" element={<ViewProject />} />
          <Route path="/projects/:id/edit" element={<UpdateProject />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  )
}
