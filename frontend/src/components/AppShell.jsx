import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

export default function AppShell({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

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
                    ? "bg-indigo-50 text-indigo-600"
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
              B
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Bharath Naik
              </p>

              <p className="truncate text-xs text-slate-400">
                View profile
              </p>
            </div>
          </Link>

          <Link
            to="/login"
            className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={18} />
            Sign out
          </Link>

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

          <Link to="/profile">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              B
            </div>
          </Link>

        </div>

      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative h-full w-72 bg-white p-5 shadow-xl">

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

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
                );
              })}

            </nav>

          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">

        {/* Desktop topbar */}
        <div className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

          <div className="relative w-80">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              placeholder="Search skills..."
              className="w-full rounded-xl bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          <div className="flex items-center gap-5">

            <button className="relative text-slate-500">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-indigo-600" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <Link
              to="/profile"
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                B
              </div>

              <span className="text-sm font-semibold text-slate-700">
                Bharath
              </span>
            </Link>

          </div>

        </div>

        <main>{children}</main>

      </div>
    </div>
  );
}