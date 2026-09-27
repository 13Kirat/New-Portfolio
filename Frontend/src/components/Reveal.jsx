import React from "react";
import { motion } from "framer-motion";

// Thin wrapper that fades + slides its children in once they enter the viewport.
const Reveal = ({
  children,
  delay = 0,
  y = 24,
  duration = 0.6,
  className,
  once = true,
  amount = 0.2,
  // eslint-disable-next-line no-unused-vars -- used as the <Component> JSX tag below
  as: Component = motion.div,
}) => {
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </Component>
  );
};

export default Reveal;
