import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const sessions = [
  {
    title: "React Fundamentals",
    person: "Ananya Sharma",
    type: "Learning",
    date: "21 Sep 2026",
    time: "10:00 AM",
    status: "Upcoming",
  },
  {
    title: "Java OOP Concepts",
    person: "Rahul Kumar",
    type: "Teaching",
    date: "22 Sep 2026",
    time: "4:00 PM",
    status: "Pending",
  },
  {
    title: "DSA — Arrays & Strings",
    person: "Sneha Rao",
    type: "Learning",
    date: "15 Sep 2026",
    time: "6:00 PM",
    status: "Completed",
  },
];

export default function Sessions() {
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/dashboard" className="text-xl font-bold">
            Skill<span className="text-indigo-600">Sync</span>
          </Link>

          <nav className="hidden gap-7 text-sm font-medium md:flex">

            <Link to="/dashboard" className="text-slate-500">
              Dashboard
            </Link>

            <Link to="/discover" className="text-slate-500">
              Discover
            </Link>

            <Link to="/sessions" className="text-indigo-600">
              Sessions
            </Link>

          </nav>

          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
          >
            B
          </Link>

        </div>

      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">

        <div>

          <p className="text-sm font-semibold text-indigo-600">
            Learning activity
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Your Sessions
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your upcoming and completed learning sessions.
          </p>

        </div>

        {/* TABS */}
        <div className="mt-8 flex gap-6 border-b border-slate-200">

          <button className="border-b-2 border-indigo-600 pb-3 text-sm font-semibold text-indigo-600">
            All Sessions
          </button>

          <button className="pb-3 text-sm font-medium text-slate-500">
            Upcoming
          </button>

          <button className="pb-3 text-sm font-medium text-slate-500">
            Completed
          </button>

        </div>

        {/* SESSION LIST */}
        <div className="mt-6 space-y-4">

          {sessions.map((session) => (
            <SessionCard
              key={`${session.title}-${session.person}`}
              session={session}
            />
          ))}

        </div>

      </main>
    </div>
  );
}

function SessionCard({ session }) {

  const statusStyle = {
    Upcoming: "bg-indigo-50 text-indigo-600",
    Pending: "bg-yellow-50 text-yellow-700",
    Completed: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarDays size={21} />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="font-bold text-slate-900">
                {session.title}
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[session.status]}`}
              >
                {session.status}
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              {session.type} with{" "}
              <span className="font-medium text-slate-700">
                {session.person}
              </span>
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} />
                {session.date}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 size={14} />
                {session.time}
              </span>

            </div>

          </div>

        </div>

        <div className="flex gap-2">

          {session.status === "Pending" && (
            <>
              <button className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 size={18} />
              </button>

              <button className="rounded-lg bg-red-50 p-2.5 text-red-500">
                <XCircle size={18} />
              </button>
            </>
          )}

          {session.status === "Upcoming" && (
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">
              <MessageCircle size={16} />
              Details
            </button>
          )}

        </div>

      </div>

    </div>
  );
}