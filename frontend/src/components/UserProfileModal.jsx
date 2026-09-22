import { useEffect, useState } from "react";
import {
  X,
  Star,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  MessageCircle,
  Send,
  Loader2,
  Award,
  Sparkles,
} from "lucide-react";
import { profileAPI } from "../services/api";

export default function UserProfileModal({ userId, onClose, onRequestSession }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await profileAPI.getUserProfile(userId);
        setProfileData(res);
      } catch (err) {
        console.error("Failed to load student profile:", err);
        setError(err.message || "Failed to load student profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!userId) return null;

  const student = profileData?.user;
  const reviews = profileData?.reviews || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <p className="text-sm font-semibold text-slate-500">Loading student profile & reviews...</p>
          </div>
        ) : error ? (
          <div className="my-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        ) : student ? (
          <div>
            {/* Top Student Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-100 pb-6">
              <div className="relative">
                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={student.name}
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-600 shadow-sm border border-indigo-200">
                    {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                  {student.rating && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {student.rating}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span>{student.department || "Computer Science"}</span>
                  {student.college && <span>· {student.college}</span>}
                  {student.year && <span>· Year {student.year}</span>}
                </p>

                {student.availability && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    <Clock size={13} />
                    Availability: {student.availability}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {student.bio && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About</h4>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {student.bio}
                </p>
              </div>
            )}

            {/* Skills grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
                  <Sparkles size={14} /> Can Teach
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {student.skillsToTeach && student.skillsToTeach.length > 0 ? (
                    student.skillsToTeach.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-xs"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No teaching skills listed</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <BookOpen size={14} /> Wants to Learn
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {student.skillsToLearn && student.skillsToLearn.length > 0 ? (
                    student.skillsToLearn.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No learning skills listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Star size={18} className="fill-amber-400 text-amber-400" />
                  Peer Reviews & Ratings ({reviews.length})
                </h3>
              </div>

              {reviews.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                  <Award size={28} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-slate-600">No reviews yet</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Be the first peer student to complete a session with {student.name} and leave a review!
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3.5 max-h-60 overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-indigo-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {rev.reviewer?.profileImage ? (
                            <img
                              src={rev.reviewer.profileImage}
                              alt={rev.reviewer.name}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                              {rev.reviewer?.name ? rev.reviewer.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}

                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {rev.reviewer?.name || "Peer Student"}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {rev.reviewer?.department || "Student"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-amber-700">{rev.rating} / 5</span>
                        </div>
                      </div>

                      {rev.comment && (
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-600 italic bg-slate-50/80 p-2.5 rounded-xl">
                          "{rev.comment}"
                        </p>
                      )}

                      <p className="mt-2 text-[10px] text-slate-400 text-right">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRequestSession) onRequestSession(student);
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition"
              >
                <Send size={15} />
                Request Session
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
