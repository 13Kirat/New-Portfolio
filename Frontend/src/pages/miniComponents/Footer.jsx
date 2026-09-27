import React from "react";
import { Github, Instagram, Linkedin } from "lucide-react";

const socials = [
  { href: "https://github.com/13Kirat", Icon: Github },
  { href: "https://www.linkedin.com/in/gurkiratsingh2004", Icon: Linkedin },
  { href: "https://instagram.com/13_kirat.x", Icon: Instagram },
];

const Footer = () => {
  return (
    <footer className="mt-10 w-full border-t border-border">
      <div className="max-w-[1100px] mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"<"}</span>
          Gurkirat Singh
          <span className="text-primary">{" />"}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line no-unused-vars -- Icon used as JSX tag below */}
          {socials.map(({ href, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-border py-5 text-center font-mono text-xs text-muted-foreground">
        <span className="tok-com">// built with React, Three.js &amp; a lot of coffee</span>
        <p className="mt-1">$ echo "© {new Date().getFullYear()} Gurkirat Singh — all rights reserved."</p>
      </div>
    </footer>
  );
};

export default Footer;
