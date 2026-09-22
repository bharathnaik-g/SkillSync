import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ArrowRight,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
  X,
  Loader2,
  CalendarDays,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { matchAPI, sessionAPI } from "../services/api";

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || searchParams.get("search") || "";

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");

  const [query, setQuery] = useState(initialQuery);
  const [department, setDepartment] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Request session modal state
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestSkill, setRequestSkill] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestDateTime, setRequestDateTime] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  // Sync state if URL search param changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") || searchParams.get("search") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  const fetchMatches = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      setError("");
      const res = await matchAPI.getMatches(searchQuery);

      setMatches(res.matches || []);
      if (res.message && (!res.matches || res.matches.length === 0)) {
        setEmptyMessage(res.message);
      } else {
        setEmptyMessage("");
      }
    } catch (err) {
      console.error("Failed to load matches:", err);
      setError(err.message || "Failed to fetch student matches.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when query changes (with debouncing)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMatches(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchMatches]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchParams({}, { replace: true });
  };

  const matchesSkill = (skill, searchStr) => {
    if (!skill || !searchStr) return false;
    const s = skill.toLowerCase().trim();
    const q = searchStr.toLowerCase().trim();
    if (s === q) return true;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|\\b|\\s)${escaped}(?:$|\\b|\\s)`, "i");
    return regex.test(s);
  };

  const filteredStudents = useMemo(() => {
    let result = matches.filter((student) => {
      const search = query.toLowerCase().trim();
      const teaches = student.skillsToTeach || [];

      const matchesSearch =
        !search ||
        (student.name && student.name.toLowerCase().includes(search)) ||
        (student.department && student.department.toLowerCase().includes(search)) ||
        teaches.some((skill) => matchesSkill(skill, search));

      const matchesDepartment =
        department === "All" ||
        student.department === department;

      return matchesSearch && matchesDepartment;
    });

    if (sort === "Alphabetical") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [matches, query, department, sort]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const openRequestModal = (student) => {
    setSelectedMentor(student);
    const defaultSkill = (student.skillsToTeach && student.skillsToTeach[0]) || "";
    setRequestSkill(defaultSkill);
    setRequestMessage("");
    
    // Default datetime: tomorrow at 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setRequestDateTime(localIso);

    setRequestError("");
    setRequestSuccess("");
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestSkill) {
      setRequestError("Please select or specify a skill.");
      return;
    }
    if (!requestDateTime) {
      setRequestError("Please select a date and time.");
      return;
    }

    try {
      setSendingRequest(true);
      setRequestError("");
      await sessionAPI.createSession({
        mentorId: selectedMentor._id,
        skill: requestSkill,
        message: requestMessage,
        scheduledAt: new Date(requestDateTime).toISOString(),
      });

      setRequestSuccess(`Session request sent to ${selectedMentor.name}!`);
      setTimeout(() => {
        setSelectedMentor(null);
        setRequestSuccess("");
      }, 2000);
    } catch (err) {
      setRequestError(err.message || "Failed to send session request.");
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Discover & Match
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Find your learning partner
          </h1>

          <p className="mt-2 text-slate-500">
            Discover peer mentors whose teaching skills match what you want to learn.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchMatches(query);
          }}
          className="mt-7 flex gap-3"
        >
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search by name, skill (Java, React, DSA), or department..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
            />

            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
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
                Sort by
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option>Recommended</option>
                <option>Alphabetical</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {query ? (
              <>
                Search results for "<span className="font-semibold text-slate-900">{query}</span>":{" "}
                <span className="font-semibold text-indigo-600">{filteredStudents.length}</span> students found
              </>
            ) : (
              <>
                <span className="font-semibold text-slate-900">{filteredStudents.length}</span> students found
              </>
            )}
          </p>

          {favorites.length > 0 && (
            <span className="text-xs text-slate-400">
              {favorites.length} saved
            </span>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="mt-12 flex h-48 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Search size={30} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-900">
              No matching mentors found
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {query
                ? `No student found for "${query}". Try searching for another skill like React, Java, DSA, or Python!`
                : emptyMessage ||
                  "Add skills you want to learn in your Profile page so our engine can find matching mentors!"}
            </p>

            {query ? (
              <button
                onClick={handleClearSearch}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/profile"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
              >
                Update Profile Skills
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                favorite={favorites.includes(student._id)}
                onFavorite={() => toggleFavorite(student._id)}
                onRequest={() => openRequestModal(student)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request Session Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Request Session
                </h3>
                <p className="text-xs text-slate-500">
                  with {selectedMentor.name} ({selectedMentor.department || "Student"})
                </p>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {requestSuccess ? (
              <div className="my-6 rounded-2xl bg-emerald-50 p-6 text-center text-emerald-700">
                <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-500" />
                <p className="font-bold">{requestSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="mt-6 space-y-4">
                {requestError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    <AlertCircle size={16} />
                    {requestError}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                    Skill to Learn
                  </label>
                  {selectedMentor.skillsToTeach && selectedMentor.skillsToTeach.length > 0 ? (
                    <select
                      value={requestSkill}
                      onChange={(e) => setRequestSkill(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    >
                      {selectedMentor.skillsToTeach.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={requestSkill}
                      onChange={(e) => setRequestSkill(e.target.value)}
                      placeholder="e.g. React"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                    Proposed Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={requestDateTime}
                    onChange={(e) => setRequestDateTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                    Message to Mentor (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Briefly explain what you'd like to focus on..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={sendingRequest}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {sendingRequest ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StudentCard({ student, favorite, onFavorite, onRequest }) {
  const initial = student.name ? student.name.charAt(0).toUpperCase() : "S";
  const teaches = student.skillsToTeach || [];

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                {initial}
              </div>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">{student.name}</h2>

              <p className="mt-1 text-xs text-slate-500">
                {student.department || "Computer Science"} · {student.year || 5}th semester
              </p>

              <div className="mt-2 flex items-center gap-1 text-sm">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {student.rating ? `${student.rating} ★` : "New"}
                </span>
                <span className="text-slate-400">
                  {student.totalReviews > 0
                    ? `· ${student.totalReviews} review${student.totalReviews > 1 ? "s" : ""}`
                    : "· Peer Mentor"}
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
            <Heart size={19} className={favorite ? "fill-current" : ""} />
          </button>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {student.bio || "Available for skill exchange sessions."}
        </p>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Can teach
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {teaches.length > 0 ? (
              teaches.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No skills listed</span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onRequest}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Request Session
        <ArrowRight size={16} />
      </button>
    </article>
  );
}