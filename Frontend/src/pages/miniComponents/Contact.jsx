import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Mail, MapPin, Send } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Contact = () => {
  const [senderName, setSenderName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(
        `${BACKEND_URL}/api/v1/message/send`,
        { senderName, email, phone, subject, message },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setSenderName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="w-full flex flex-col gap-10">
      <SectionHeading kicker="let's talk" title="CONTACT" accent="ME" />

      <div className="grid md:grid-cols-2 gap-10">
        <Reveal className="flex flex-col gap-6 font-mono">
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            <span className="tok-com">
              // Have a project in mind, or just want to say hi? My inbox is open.
            </span>
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            gs9965416@gmail.com
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            Patiala, Punjab, India
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleMessage} className="terminal-window p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="font-mono text-sm text-muted-foreground">Your Name</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="font-mono text-sm text-muted-foreground">
                  Email <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-mono text-sm text-muted-foreground">
                  Phone <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-mono text-sm text-muted-foreground">Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-mono text-sm text-muted-foreground">Message</Label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
              />
            </div>
            <Button disabled={loading} className="w-full gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
};

export default Contact;
