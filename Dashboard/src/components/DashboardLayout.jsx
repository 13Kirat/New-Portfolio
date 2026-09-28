import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FolderGit,
  History,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquareMore,
  PencilRuler,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/store/slices/userSlice";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/", end: true, Icon: LayoutDashboard },
  { label: "Projects", to: "/projects", Icon: FolderGit },
  { label: "Skills", to: "/skills", Icon: PencilRuler },
  { label: "Apps", to: "/apps", Icon: LayoutGrid },
  { label: "Timeline", to: "/timeline", Icon: History },
  { label: "Messages", to: "/messages", Icon: MessageSquareMore },
  { label: "Account", to: "/account", Icon: User },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 font-mono text-sm transition-colors ${
    isActive
      ? "bg-primary/10 text-primary border border-primary/30"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent"
  }`;

const DashboardLayout = () => {
  const { isAuthenticated, authChecked, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out!");
    navigateTo("/login");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    // Wait for the initial getUser() check to resolve before deciding to bounce
    // to /login — otherwise a hard refresh always redirects away first (Redux
    // state starts as isAuthenticated:false) and then flips back once the
    // check completes, which looks like it's "auto re-authorizing".
    if (authChecked && !isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated, authChecked]);

  if (!authChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">$</span> checking session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-60 shrink-0 border-r border-border bg-card/40 min-h-screen sticky top-0">
        <div className="px-5 py-5 border-b border-border">
          <span className="font-mono text-lg font-bold">
            <span className="text-primary">{"<"}</span>
            Kirat
            <span className="text-primary">{" />"}</span>
          </span>
          <p className="font-mono text-xs text-muted-foreground mt-1">// dashboard</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {/* eslint-disable-next-line no-unused-vars -- Icon used as JSX tag below */}
          {NAV_ITEMS.map(({ label, to, end, Icon }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 font-mono text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sm:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-background/90 backdrop-blur-md">
        <span className="font-mono text-base font-bold">
          <span className="text-primary">{"<"}</span>Kirat<span className="text-primary">{" />"}</span>
        </span>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col p-5">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-lg font-bold">
              <span className="text-primary">{"<"}</span>Kirat<span className="text-primary">{" />"}</span>
            </span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            {/* eslint-disable-next-line no-unused-vars -- Icon used as JSX tag below */}
            {NAV_ITEMS.map(({ label, to, end, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-md px-3 py-2 font-mono text-sm text-muted-foreground hover:text-destructive mt-4"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="hidden sm:flex items-center gap-4 px-6 h-16 border-b border-border bg-card/20">
          <img
            src={user?.avatar?.url}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border border-border"
          />
          <p className="font-mono text-sm text-muted-foreground">
            Welcome back, <span className="text-foreground">{user?.fullName}</span>
          </p>
        </header>
        <main className="flex-1 pt-14 sm:pt-0 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
