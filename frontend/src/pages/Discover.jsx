import { useMemo, useState } from "react";
import {
  ArrowRight,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { students } from "../data/mockData";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredStudents = useMemo(() => {
    let result = students.filter((student) => {

      const search = query.toLowerCase();

      const matchesSearch =
        !search ||
        student.name.toLowerCase().includes(search) ||
        student.teaches.some((skill) =>
          skill.toLowerCase().includes(search)
        );

      const matchesDepartment =
        department === "All" ||
        student.department === department;

      const matchesRating =
        rating === "All" ||
        student.rating >= Number(rating);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesRating
      );
    });

    if (sort === "Highest rated") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "Most sessions") {
      result.sort((a, b) => b.sessions - a.sessions);
    }

    return result;
  }, [query, department, rating, sort]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <AppShell>

      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">

        <div>

          <p className="text-sm font-semibold text-indigo-600">
            Discover
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Find your learning partner
          </h1>

          <p className="mt-2 text-slate-500">
            Discover students who can teach what you want to learn.
          </p>

        </div>

        {/* Search */}
        <div className="mt-7 flex gap-3">

          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Java, React, DSA, Figma..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={17} />
              </button>
            )}

          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">
              Filters
            </span>
          </button>

        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                Department
              </label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option>All</option>
                <option>Computer Science</option>
                <option>Information Science</option>
                <option>Electronics</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                Minimum rating
              </label>

              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option value="All">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
                <option value="4.8">4.8+ stars</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                Sort by
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option>Recommended</option>
                <option>Highest rated</option>
                <option>Most sessions</option>
              </select>
            </div>

          </div>
        )}

        {/* Results */}
        <div className="mt-8 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {filteredStudents.length}
            </span>{" "}
            students found
          </p>

          <span className="text-xs text-slate-400">
            {favorites.length} saved
          </span>

        </div>

        {filteredStudents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <Search
              size={30}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No students found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another skill or adjust your filters.
            </p>

          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                favorite={favorites.includes(student.id)}
                onFavorite={() => toggleFavorite(student.id)}
              />
            ))}

          </div>
        )}

      </div>

    </AppShell>
  );
}

function StudentCard({
  student,
  favorite,
  onFavorite,
}) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100">

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <div className="relative">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
              {student.avatar}
            </div>

            {student.online && (
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            )}

          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              {student.name}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {student.department} · {student.semester} semester
            </p>

            <div className="mt-2 flex items-center gap-1 text-sm">

              <Star
                size={14}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="font-semibold">
                {student.rating}
              </span>

              <span className="text-slate-400">
                · {student.sessions} sessions
              </span>

            </div>

          </div>

        </div>

        <button
          onClick={onFavorite}
          className={`rounded-lg p-2 ${
            favorite
              ? "bg-red-50 text-red-500"
              : "text-slate-300 hover:bg-slate-50 hover:text-red-400"
          }`}
        >
          <Heart
            size={19}
            className={favorite ? "fill-current" : ""}
          />
        </button>

      </div>

      <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
        {student.about}
      </p>

      <div className="mt-5">

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

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
        Request Session
        <ArrowRight size={16} />
      </button>

    </article>
  );
}