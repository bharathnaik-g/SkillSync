import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Compass,
  Menu,
  Search,
  UserRound,
  X,
  LogOut,
  Map,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export default function AppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    toast,
    markAllAsRead,
    dismissToast,
  } = useNotifications();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [topSearch, setTopSearch] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTopSearchSubmit = (e) => {
    e.preventDefault();
    if (topSearch.trim()) {
      navigate(`/discover?q=${encodeURIComponent(topSearch.trim())}`);
    } else {
      navigate("/discover");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BookOpen,
    },
    {
      name: "Discover",
      path: "/discover",
      icon: Compass,
    },
    {
      name: "Sessions",
      path: "/sessions",
      icon: CalendarDays,
    },
    {
      name: "Roadmaps",
      path: "/roadmap",
      icon: Map,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Floating In-App Chat Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center justify-between gap-4 w-96 rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-indigo-500/30 animate-bounce">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              <MessageSquare size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                New Chat Message
              </p>
              <h4 className="truncate text-sm font-bold text-white">
                {toast.senderName} ({toast.sessionSkill})
              </h4>
              <p className="truncate text-xs text-slate-300 mt-0.5">
                "{toast.text}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                dismissToast();
                navigate("/sessions");
              }}
              className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
            >
              View
              <ArrowRight size={12} />
            </button>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <Link
          to="/dashboard"
          className="flex h-20 items-center gap-2 border-b border-slate-100 px-6"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <span className="text-sm font-bold">S</span>
          </div>

          <span className="text-xl font-bold text-slate-900">
            Skill<span className="text-indigo-600">Sync</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "Student User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                View profile
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-slate-600"
          >
            <Menu size={22} />
          </button>

          <Link
            to="/dashboard"
            className="text-lg font-bold"
          >
            Skill<span className="text-indigo-600">Sync</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                markAllAsRead();
              }}
              className="relative text-slate-600 p-1"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <Link to="/profile">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                {initial}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative h-full w-72 bg-white p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">
                  Skill<span className="text-indigo-600">Sync</span>
                </span>

                <button onClick={() => setMobileOpen(false)}>
                  <X />
                </button>
              </div>

              <nav className="mt-8 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-indigo-50 text-indigo-600 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={19} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-500"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Desktop topbar */}
        <div className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
          <form onSubmit={handleTopSearchSubmit} className="relative w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              placeholder="Search skills (e.g. React, Java)..."
              className="w-full rounded-xl bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </form>

          <div className="flex items-center gap-5 relative">
            {/* Bell Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (unreadCount > 0) markAllAsRead();
                }}
                className="relative text-slate-500 hover:text-slate-700 p-1"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Notifications
                    </h4>
                    <span className="text-xs text-slate-400">
                      {notifications.length} total
                    </span>
                  </div>

                  <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setShowNotifDropdown(false);
                            navigate("/sessions");
                          }}
                          className="cursor-pointer rounded-xl p-2.5 hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">
                              {n.senderName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                            {n.sessionSkill} Session
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            "{n.text}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <Link
              to="/profile"
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {initial}
              </div>

              <span className="text-sm font-semibold text-slate-700">
                {user?.name ? user.name.split(" ")[0] : "Student"}
              </span>
            </Link>
          </div>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}