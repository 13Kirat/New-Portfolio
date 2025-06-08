import React, { useEffect, useState } from "react";

const About = () => {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <div className="relative">
        <h1
          className="flex gap-4 items-center text-[2rem] sm:text-[2.75rem] 
          md:text-[3rem] lg:text-[3.8rem] leading-[56px] md:leading-[67px] 
          lg:leading-[90px] tracking-[15px] mx-auto w-fit font-extrabold about-h1"
          style={{
            background: "hsl(222.2 84% 4.9%)",
          }}
        >
          ABOUT <span className="text-tubeLight-effect font-extrabold">ME</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200"></span>
      </div>
      <div className="text-center">
        <p className="uppercase text-xl text-slate-400">
          Allow me to introduce myself.
        </p>
      </div>
      <div>
        <div className="grid md:grid-cols-2 my-8 sm:my-20 gap-14">
          <div className="flex justify-center items-center">
            <img
              src="/me2.jpg"
              alt="avatar"
              className="bg-white p-2 sm:p-4 rotate-[25deg] h-[240px] sm:h-[340px] md:h-[350px] lg:h-[450px]"
            />
          </div>
          <div className="flex justify-center flex-col tracking-[1px] text-xl gap-5">
            <p>
              My name is Gurkirat Singh. I’m currently pursuing Electronics and Computer Engineering at Thapar University, and I'll be graduating in 2027. I work as a mobile app and web developer, and I’ve interned in real-world projects using React Native and the MERN stack.
            </p>
            <p>
              I’m passionate about building practical solutions — from B2B e-commerce apps to community-based platforms. Outside of tech, I enjoy watching movies and series, exploring gaming occasionally, and engaging in student-led technical events and hackathons.
            </p>
          </div>
        </div>
        <p className="tracking-[1px] text-xl">
          I value consistency and creativity in my work. Whether it’s managing deadlines or experimenting with new ideas, I stay committed to learning, adapting, and delivering impactful results.
        </p>
      </div>
    </div>
  );
};

export default About;
