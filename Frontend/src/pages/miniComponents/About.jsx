import React from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CodeLeak from "@/components/CodeLeak";

const About = () => {
  return (
    <div className="relative w-full flex flex-col gap-12">
      <CodeLeak count={3} seed={2} />
      <SectionHeading kicker="who am i" title="ABOUT" accent="ME" />

      <div className="relative grid md:grid-cols-2 gap-10 items-center">
        <Reveal delay={0.05} className="flex justify-center">
          <div className="terminal-window w-fit">
            <div className="terminal-window-bar">
              <span className="terminal-window-dot bg-[#ff5f56]" />
              <span className="terminal-window-dot bg-[#ffbd2e]" />
              <span className="terminal-window-dot bg-[#27c93f]" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">me.jpg</span>
            </div>
            <img
              src="/me2.jpg"
              alt="Gurkirat Singh"
              className="h-[280px] sm:h-[340px] md:h-[380px] w-auto object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="terminal-window">
            <div className="terminal-window-bar">
              <span className="terminal-window-dot bg-[#ff5f56]" />
              <span className="terminal-window-dot bg-[#ffbd2e]" />
              <span className="terminal-window-dot bg-[#27c93f]" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">about.js</span>
            </div>
            <div className="p-5 sm:p-6 font-mono text-[0.85rem] sm:text-sm leading-relaxed overflow-x-auto">
              <p><span className="tok-kw">const</span> about = {"{"}</p>
              <p className="pl-4">name: <span className="tok-str">"Gurkirat Singh"</span>,</p>
              <p className="pl-4">role: <span className="tok-str">"Full Stack Developer"</span>,</p>
              <p className="pl-4">studying: <span className="tok-str">"B.E. Electronics & Computer, Thapar University"</span>,</p>
              <p className="pl-4">graduating: <span className="tok-num">2027</span>,</p>
              <p className="pl-4">focus: [<span className="tok-str">"React Native"</span>, <span className="tok-str">"MERN"</span>, <span className="tok-str">"Cloud"</span>],</p>
              <p className="pl-4">outsideOfCode: [<span className="tok-str">"movies"</span>, <span className="tok-str">"gaming"</span>, <span className="tok-str">"hackathons"</span>],</p>
              <p>{"}"};</p>
              <p className="mt-4 tok-com">// I value consistency and creativity — shipping</p>
              <p className="tok-com">// practical solutions and always learning something new.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default About;
