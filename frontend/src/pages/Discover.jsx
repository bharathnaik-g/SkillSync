import {
  Search,
  Star,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const students = [
  {
    name: "Ananya Sharma",
    department: "Computer Science",
    semester: "6th Semester",
    teaches: ["React", "JavaScript", "UI Design"],
    learns: ["Python", "AI"],
    rating: "4.9",
    sessions: 18,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Rahul Kumar",
    department: "Information Science",
    semester: "5th Semester",
    teaches: ["Java", "DSA", "C++"],
    learns: ["React", "Node.js"],
    rating: "4.7",
    sessions: 14,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Sneha Rao",
    department: "Computer Science",
    semester: "4th Semester",
    teaches: ["Figma", "UI/UX", "HTML"],
    learns: ["React", "Frontend"],
    rating: "4.8",
    sessions: 11,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Arjun Shetty",
    department: "Information Science",
    semester: "7th Semester",
    teaches: ["Python", "Machine Learning", "SQL"],
    learns: ["Cybersecurity", "Cloud"],
    rating: "4.6",
    sessions: 21,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function Discover() {
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/dashboard" className="text-xl font-bold">
            Skill<span className="text-indigo-600">Sync</span>
          </Link>

          <nav className="hidden gap-7 text-sm font-medium md:flex">

            <Link
              to="/dashboard"
              className="text-slate-500"
            >
              Dashboard
            </Link>

            <Link
              to="/discover"
              className="text-indigo-600"
            >
              Discover
            </Link>

            <Link
              to="/sessions"
              className="text-slate-500"
            >
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

      <main className="mx-auto max-w-7xl px-6 py-8">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Discover
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Find your learning partner
          </h1>

          <p className="mt-2 text-slate-500">
            Search students by the skills they can teach.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-7 flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              placeholder="Search by skill..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />

          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
            <SlidersHorizontal size={17} />
            Filters
          </button>

        </div>

        {/* RESULTS */}
        <div className="mt-8 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              24
            </span>{" "}
            students found
          </p>

          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option>Recommended</option>
            <option>Highest rated</option>
            <option>Most sessions</option>
          </select>

        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          {students.map((student) => (
            <StudentCard
              key={student.name}
              student={student}
            />
          ))}

        </div>

      </main>
    </div>
  );
}

function StudentCard({ student }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-100">

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${student.color}`}
          >
            {student.name.charAt(0)}
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              {student.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {student.department} · {student.semester}
            </p>

            <div className="mt-2 flex items-center gap-1 text-sm">
              <Star size={15} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{student.rating}</span>
              <span className="text-slate-400">
                · {student.sessions} sessions
              </span>
            </div>

          </div>

        </div>

      </div>

      <div className="mt-6">

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Can teach
        </p>

        <div className="mt-2 flex flex-wrap gap-2">

          {student.teaches.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      <div className="mt-5">

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Wants to learn
        </p>

        <div className="mt-2 flex flex-wrap gap-2">

          {student.learns.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
        View Profile
        <ArrowRight size={16} />
      </button>

    </div>
  );
}