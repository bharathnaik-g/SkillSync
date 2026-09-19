import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  X,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { sessions as initialSessions } from "../data/mockData";

export default function Sessions() {
  const [sessions, setSessions] =
    useState(initialSessions);

  const [tab, setTab] = useState("All");

  const filtered = useMemo(() => {

    if (tab === "All") return sessions;

    return sessions.filter(
      (session) => session.status === tab
    );

  }, [sessions, tab]);

  const updateStatus = (id, status) => {

    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? {
              ...session,
              status,
            }
          : session
      )
    );
  };

  return (
    <AppShell>

      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8">

        <p className="text-sm font-semibold text-indigo-600">
          Learning activity
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Your Sessions
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your learning and teaching sessions.
        </p>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-slate-200">

          {["All", "Upcoming", "Pending", "Completed"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                  tab === item
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                {item}
              </button>
            )
          )}

        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <CalendarDays
              size={30}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No sessions here
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your {tab.toLowerCase()} sessions will appear here.
            </p>

          </div>
        ) : (
          <div className="mt-6 space-y-4">

            {filtered.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onAccept={() =>
                  updateStatus(
                    session.id,
                    "Upcoming"
                  )
                }
                onReject={() =>
                  updateStatus(
                    session.id,
                    "Cancelled"
                  )
                }
                onComplete={() =>
                  updateStatus(
                    session.id,
                    "Completed"
                  )
                }
              />
            ))}

          </div>
        )}

      </div>

    </AppShell>
  );
}

function SessionCard({
  session,
  onAccept,
  onReject,
  onComplete,
}) {

  const statusClasses = {
    Upcoming: "bg-indigo-50 text-indigo-600",
    Pending: "bg-yellow-50 text-yellow-700",
    Completed: "bg-emerald-50 text-emerald-600",
    Cancelled: "bg-red-50 text-red-500",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarDays size={20} />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="font-bold text-slate-900">
                {session.title}
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusClasses[session.status] ||
                  "bg-slate-100 text-slate-500"
                }`}
              >
                {session.status}
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              {session.type} with{" "}
              <span className="font-semibold text-slate-700">
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

              <span>
                {session.skill}
              </span>

            </div>

          </div>

        </div>

        <div className="flex gap-2">

          {session.status === "Pending" && (
            <>
              <button
                onClick={onAccept}
                className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
              >
                <Check size={16} />
                Accept
              </button>

              <button
                onClick={onReject}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-100"
              >
                <X size={16} />
                Reject
              </button>
            </>
          )}

          {session.status === "Upcoming" && (
            <>
              <button
                onClick={onComplete}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Complete
              </button>

              <button className="rounded-xl border border-slate-200 p-2 text-slate-500">
                <MessageCircle size={17} />
              </button>
            </>
          )}

        </div>

      </div>

    </article>
  );
}