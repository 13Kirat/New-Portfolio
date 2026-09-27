import React from "react";
import { Card } from "@/components/ui/card";
// eslint-disable-next-line no-unused-vars -- used via JSX member tags (<motion.div>)
import { motion } from "framer-motion";

// Shared hover card for Skills + MyApps grids. `proficiency` is optional (0-100).
const IconCard = ({ iconUrl, title, proficiency }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="glow-border h-full p-5 sm:p-6 flex flex-col justify-center items-center gap-3 bg-card/60 backdrop-blur-sm border-border">
        <img
          src={iconUrl}
          alt={title}
          loading="lazy"
          className="h-10 sm:h-14 w-auto object-contain"
        />
        <p className="text-sm sm:text-base text-muted-foreground text-center font-mono">
          {title}
        </p>
        {typeof proficiency === "number" && (
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, Math.max(0, proficiency))}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default IconCard;
