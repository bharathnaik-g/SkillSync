import { useEffect, useState } from "react";
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
  Loader2,
  Map,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { matchAPI, sessionAPI } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ratingData, setRatingData] = useState({ averageRating: null, totalReviews: 0 });
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Load matches
        try {
          const matchRes = await matchAPI.getMatches();
          setMatches(matchRes.matches || []);
        } catch (e) {
          console.error("Matches load error:", e);
        }

        const userId = user?._id || user?.id;

        // Load reviews & rating for current user
        if (userId) {
          try {
            const reviewRes = await sessionAPI.getUserReviews(userId);
            setRatingData({
              averageRating: reviewRes.averageRating,
              totalReviews: reviewRes.totalReviews || 0,
            });
          } catch (e) {
            console.error("Reviews load error:", e);
          }
        }

        // Load sessions & calculate streak
        try {
          const sessionRes = await sessionAPI.getSessions();
          const allSessions = sessionRes.sessions || [];

          let learnedCount = 0;
          let taughtCount = 0;

          const activityDates = new Set();

          allSessions.forEach((s) => {
            if (s.status === "completed" || s.status === "accepted") {
              if (s.requester?._id === userId || s.requester === userId) {
                learnedCount++;
              } else {
                taughtCount++;
              }

              const dStr = new Date(s.updatedAt || s.createdAt).toISOString().split("T")[0];
              activityDates.add(dStr);
            }
          });

          setSessionStats({ learned: learnedCount, taught: taughtCount });

          // Calculate real streak
          let streak = 0;
          if (activityDates.size > 0) {
            let curr = new Date();
            const todayStr = curr.toISOString().split("T")[0];
            curr.setDate(curr.getDate() - 1);
            const yestStr = curr.toISOString().split("T")[0];

            if (activityDates.has(todayStr) || activityDates.has(yestStr)) {
              let checkDate = activityDates.has(todayStr) ? new Date() : curr;
              while (true) {
                const dateStr = checkDate.toISOString().split("T")[0];
                if (activityDates.has(dateStr)) {
                  streak++;
                  checkDate.setDate(checkDate.getDate() - 1);
                } else {
                  break;
                }
              }
            }
          }
          setStreakDays(streak);

          // Find upcoming session
          const upcoming = allSessions.find((s) => s.status === "accepted");
          setNextSession(upcoming || null);
        } catch (e) {
          console.error("Sessions load error:", e);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/discover");
    }
  };

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        {/* Greeting */}
        <section>
          <p className="text-sm font-semibold text-indigo-600">{currentDate}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || "Student"}
          </h1>

          <p className="mt-2 text-slate-500">
            Ready to learn something new or mentor a peer today?
          </p>
        </section>

        {/* Search hero */}
        <section className="relative mt-8 overflow-hidden rounded-3xl bg-indigo-600 p-6 shadow-xl shadow-indigo-100 sm:p-8">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-400/30 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
              <Zap size={16} />
              Skill Matching Engine
            </div>

            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              What do you want to learn today?
            </h2>

            <p className="mt-2 text-indigo-100">
              Find campus peers who can teach Java, React, DSA, AI and more.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 flex rounded-2xl bg-white p-1.5 shadow-lg"
            >
              <Search size={20} className="ml-3 self-center text-slate-400" />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try searching Java, React, DSA..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
              />

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            icon={<BookOpen />}
            label="Sessions Learned"
            value={sessionStats.learned.toString()}
            detail="Active learning"
          />

          <Stat
            icon={<Users />}
            label="Sessions Taught"
            value={sessionStats.taught.toString()}
            detail="Active mentoring"
          />

          <Stat
            icon={<Star />}
            label="Peer Rating"
            value={
              ratingData.averageRating
                ? `${ratingData.averageRating} ★`
                : "New"
            }
            detail={
              ratingData.totalReviews > 0
                ? `${ratingData.totalReviews} review${
                    ratingData.totalReviews > 1 ? "s" : ""
                  }`
                : "No reviews yet"
            }
          />

          <Stat
            icon={<Flame />}
            label="Learning Streak"
            value={`${streakDays} day${streakDays !== 1 ? "s" : ""}`}
            detail={
              streakDays > 0 ? "Active learning" : "Complete a session to start streak"
            }
          />
        </section>

        {/* Main content */}
        <section className="mt-7 grid gap-6 xl:grid-cols-3">
          {/* Upcoming Session */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Your next session</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Don't forget your upcoming peer session.
                </p>
              </div>

              <Link
                to="/sessions"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all
              </Link>
            </div>

            {nextSession ? (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <BookOpen />
                    </div>

                    <div>
                      <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                        Scheduled
                      </span>

                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {nextSession.skill} Session
                      </h3>

                      <p className="text-sm text-slate-500">
                        with{" "}
                        {nextSession.mentor?.name ||
                          nextSession.requester?.name ||
                          "Peer"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {new Date(nextSession.scheduledAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {new Date(nextSession.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-500">
                  No upcoming session scheduled right now.
                </p>
                <Link
                  to="/discover"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Find a mentor to schedule one →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Skill Roadmap Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <Map size={16} />
                Skill Roadmaps
              </div>

              <h2 className="mt-2 text-lg font-bold text-slate-900">
                Need a Learning Path?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Generate a custom step-by-step roadmap for any skill.
              </p>
            </div>

            <Link
              to="/roadmap"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition"
            >
              Explore Skill Roadmaps
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Recommended Matches */}
        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recommended Mentors for You
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Students whose teaching skills match your learning interests.
              </p>
            </div>

            <Link
              to="/discover"
              className="hidden text-sm font-semibold text-indigo-600 sm:block hover:text-indigo-700"
            >
              Explore all matches
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 flex h-32 items-center justify-center">
              <Loader2 size={24} className="animate-spin text-indigo-600" />
            </div>
          ) : matches.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">
                No recommended matches found yet. Add skills you want to learn in your Profile!
              </p>
              <Link
                to="/profile"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600"
              >
                Update Profile →
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {matches.slice(0, 3).map((student) => (
                <div
                  key={student._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                        {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {student.name}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {student.department || "Computer Science"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(student.skillsToTeach || []).slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-sm text-slate-500">
                      <Star size={15} className="fill-yellow-400 text-yellow-400" />
                      4.9
                    </span>

                    <Link
                      to="/discover"
                      className="text-sm font-semibold text-indigo-600"
                    >
                      Request →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <p className="mt-4 text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-xs text-emerald-600 font-medium">{detail}</p>
    </div>
  );
}