import { useState } from "react";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";

const TABS = ["Profile", "Update Profile", "Update Password"];

const Account = () => {
  const [selectedComponent, setSelectedComponent] = useState("Profile");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-mono text-2xl font-bold">
        <span className="text-gradient">Account</span> Settings
      </h1>
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-row md:flex-col gap-2 font-mono text-sm">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedComponent(tab)}
              className={`text-left px-3 py-2 rounded-md transition-colors ${
                selectedComponent === tab
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="terminal-window p-5 sm:p-6">
          {selectedComponent === "Profile" && <Profile />}
          {selectedComponent === "Update Profile" && <UpdateProfile />}
          {selectedComponent === "Update Password" && <UpdatePassword />}
        </div>
      </div>
    </div>
  );
};

export default Account;
