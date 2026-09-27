import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProjectView from './pages/ProjectView'
import Footer from './pages/miniComponents/Footer'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Preloader />
      <Navbar />
      <div id="top" />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/project/:id' element={<ProjectView />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  )
}
