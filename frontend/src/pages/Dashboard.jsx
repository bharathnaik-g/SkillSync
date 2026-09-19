import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/dashboard" className="text-xl font-bold">
            Skill<span className="text-indigo-600">Sync</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <Link
              to="/dashboard"
              className="text-indigo-600"
            >
              Dashboard
            </Link>

            <Link
              to="/discover"
              className="text-slate-500 hover:text-indigo-600"
            >
              Discover
            </Link>

            <Link
              to="/sessions"
              className="text-slate-500 hover:text-indigo-600"
            >
              Sessions
            </Link>
          </nav>

          <div className="flex items-center gap-4">

            <button className="relative text-slate-500">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-indigo-600" />
            </button>

            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
            >
              B
            </Link>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* GREETING */}
        <section className="mb-8">

          <p className="text-sm font-medium text-indigo-600">
            Your learning space
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, Bharath 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Discover people, exchange skills and keep learning.
          </p>

        </section>

        {/* SEARCH */}
        <section className="rounded-2xl bg-indigo-600 p-6 shadow-lg shadow-indigo-100">

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-indigo-200">
              Find your next learning opportunity
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              What do you want to learn today?
            </h2>

            <div className="mt-5 flex rounded-xl bg-white p-1.5">

              <Search
                size={20}
                className="ml-3 self-center text-slate-400"
              />

              <input
                placeholder="Search Java, DSA, React, Figma..."
                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
              />

              <Link
                to="/discover"
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Search
              </Link>

            </div>

          </div>

        </section>

        {/* STATS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            icon={<BookOpen size={20} />}
            label="Sessions Learned"
            value="8"
          />

          <Stat
            icon={<Users size={20} />}
            label="Sessions Taught"
            value="12"
          />

          <Stat
            icon={<Star size={20} />}
            label="Your Rating"
            value="4.8"
          />

          <Stat
            icon={<Zap size={20} />}
            label="Skills"
            value="6"
          />

        </section>

        {/* GRID */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* UPCOMING */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Upcoming Session
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your next learning session
                </p>
              </div>

              <CalendarDays className="text-indigo-600" size={22} />

            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-5">

              <div className="flex items-start justify-between">

                <div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                    Learning
                  </span>

                  <h3 className="mt-3 text-xl font-bold text-slate-900">
                    React Fundamentals
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    with Ananya Sharma
                  </p>
                </div>

                <div className="h-12 w-12 rounded-full bg-indigo-100 text-center pt-3 font-bold text-indigo-600">
                  A
                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">

                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Saturday, 21 Sep
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  10:00 AM
                </span>

              </div>

            </div>

          </div>

          {/* PROFILE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">
                Profile
              </h2>

              <span className="text-sm font-bold text-indigo-600">
                70%
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[70%] rounded-full bg-indigo-600" />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Complete your profile so students can discover you
              more easily.
            </p>

            <Link
              to="/profile"
              className="mt-5 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              Complete Profile
              <ChevronRight size={17} />
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}