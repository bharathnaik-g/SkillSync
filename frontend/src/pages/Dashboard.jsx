import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Flame,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { students } from "../data/mockData";

export default function Dashboard() {
  return (
    <AppShell>

      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">

        {/* Greeting */}
        <section>
          <p className="text-sm font-semibold text-indigo-600">
            Tuesday · September 19
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Good morning, Bharath 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Ready to learn something new today?
          </p>
        </section>

        {/* Search hero */}
        <section className="relative mt-8 overflow-hidden rounded-3xl bg-indigo-600 p-6 shadow-xl shadow-indigo-100 sm:p-8">

          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-400/30 blur-3xl" />

          <div className="relative max-w-3xl">

            <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
              <Zap size={16} />
              Skill matching
            </div>

            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              What do you want to learn today?
            </h2>

            <p className="mt-2 text-indigo-100">
              Find students who already know the skills you're looking for.
            </p>

            <div className="mt-6 flex rounded-2xl bg-white p-1.5 shadow-lg">

              <Search
                size={20}
                className="ml-3 self-center text-slate-400"
              />

              <input
                placeholder="Try Java, React, DSA..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
              />

              <Link
                to="/discover"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Search
              </Link>

            </div>

          </div>
        </section>

        {/* Stats */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Stat
            icon={<BookOpen />}
            label="Sessions Learned"
            value="8"
            detail="+2 this month"
          />

          <Stat
            icon={<Users />}
            label="Sessions Taught"
            value="12"
            detail="+4 this month"
          />

          <Stat
            icon={<Star />}
            label="Average Rating"
            value="4.8"
            detail="Excellent"
          />

          <Stat
            icon={<Flame />}
            label="Learning Streak"
            value="7 days"
            detail="Keep going!"
          />

        </section>

        {/* Main content */}
        <section className="mt-7 grid gap-6 xl:grid-cols-3">

          {/* Upcoming */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Your next session
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Don't forget your upcoming learning session.
                </p>
              </div>

              <Link
                to="/sessions"
                className="text-sm font-semibold text-indigo-600"
              >
                View all
              </Link>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <BookOpen />
                  </div>

                  <div>

                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      Learning
                    </span>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      React Fundamentals
                    </h3>

                    <p className="text-sm text-slate-500">
                      with Ananya Sharma
                    </p>

                  </div>

                </div>

                <div className="space-y-2 text-sm text-slate-500">

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    Saturday, 21 Sep
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={16} />
                    10:00 AM
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Profile */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">

              <h2 className="font-bold text-slate-900">
                Profile strength
              </h2>

              <span className="font-bold text-indigo-600">
                75%
              </span>

            </div>

            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-full w-3/4 rounded-full bg-indigo-600" />
            </div>

            <div className="mt-5 space-y-3 text-sm">

              <ProgressItem
                text="Basic information"
                done
              />

              <ProgressItem
                text="Teaching skills"
                done
              />

              <ProgressItem
                text="Learning skills"
                done
              />

              <ProgressItem
                text="Availability"
              />

            </div>

            <Link
              to="/profile"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-50 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              Complete Profile
              <ArrowRight size={16} />
            </Link>

          </div>

        </section>

        {/* Recommended */}
        <section className="mt-8">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recommended for you
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Students whose skills match your learning interests.
              </p>
            </div>

            <Link
              to="/discover"
              className="hidden text-sm font-semibold text-indigo-600 sm:block"
            >
              Explore all
            </Link>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {students.slice(0, 3).map((student) => (
              <div
                key={student.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                    {student.avatar}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {student.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {student.department}
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex flex-wrap gap-2">

                  {student.teaches.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

                <div className="mt-5 flex items-center justify-between">

                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {student.rating}
                  </span>

                  <Link
                    to="/discover"
                    className="text-sm font-semibold text-indigo-600"
                  >
                    View →
                  </Link>

                </div>

              </div>
            ))}

          </div>
        </section>

      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-emerald-600">
        {detail}
      </p>

    </div>
  );
}

function ProgressItem({ text, done }) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
          done
            ? "bg-emerald-100 text-emerald-600"
            : "border border-slate-300"
        }`}
      >
        {done ? "✓" : ""}
      </div>

      <span className={done ? "text-slate-600" : "text-slate-400"}>
        {text}
      </span>

    </div>
  );
}