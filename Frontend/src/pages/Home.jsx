import React from "react";
import Hero from "./miniComponents/Hero";
import Timeline from "./miniComponents/Timeline";
import Skills from "./miniComponents/Skills";
import MyApps from "./miniComponents/MyApps";
import About from "./miniComponents/About";
import { ThemeProvider } from "@/components/theme-provider";
import Portfolio from "./miniComponents/Portfolio";
import Contact from "./miniComponents/Contact";

const Home = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <article className="relative px-5 pt-24 sm:pt-28 md:pt-32 sm:mx-auto w-full max-w-[1100px] flex flex-col gap-24 sm:gap-32">
        <section id="hero">
          <Hero />
        </section>
        <section id="about" className="scroll-mt-24">
          <About />
        </section>
        <section id="skills" className="scroll-mt-24">
          <Skills />
        </section>
        <section id="experience" className="scroll-mt-24">
          <Timeline />
        </section>
        <section id="projects" className="scroll-mt-24">
          <Portfolio />
        </section>
        <section id="apps" className="scroll-mt-24">
          <MyApps />
        </section>
        <section id="contact" className="scroll-mt-24">
          <Contact />
        </section>
      </article>
    </ThemeProvider>
  );
};

export default Home;
