import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  X,
  Loader2,
  Video,
  ExternalLink,
  Edit2,
  Save,
  Star,
} from "lucide-react";
import AppShell from "../components/AppShell";
import SessionChatModal from "../components/SessionChatModal";
import ReviewModal from "../components/ReviewModal";
import { useAuth } from "../context/AuthContext";
import { sessionAPI } from "../services/api";

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [activeChatSession, setActiveChatSession] = useState(null);
  const [activeReviewSession, setActiveReviewSession] = useState(null);

  const [tab, setTab] = useState("All");

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await sessionAPI.getSessions();
      setSessions(res.sessions || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setError(err.message || "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filtered = useMemo(() => {
    if (tab === "All") return sessions;
    if (tab === "Upcoming") return sessions.filter((s) => s.status === "accepted");
    if (tab === "Pending") return sessions.filter((s) => s.status === "pending");
    if (tab === "Completed") return sessions.filter((s) => s.status === "completed");
    if (tab === "Rejected") return sessions.filter((s) => s.status === "rejected");
    return sessions;
  }, [sessions, tab]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await sessionAPI.updateSessionStatus(id, status);
      setSessions((current) =>
        current.map((session) =>
          session._id === id
            ? { ...session, status: res.session.status }
            : session
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update session status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateMeetingLink = async (id, meetingLink) => {
    try {
      setUpdatingId(id);
      const res = await sessionAPI.updateMeetingLink(id, meetingLink);
      setSessions((current) =>
        current.map((s) => (s._id === id ? res.session : s))
      );
    } catch (err) {
      alert(err.message || "Failed to update meeting link");
    } finally {
      setUpdatingId(null);
    }
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
          Manage your peer learning requests, Google Meet meetings, and live chat.
        </p>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-slate-200">
          {["All", "Upcoming", "Pending", "Completed", "Rejected"].map((item) => (
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
          ))}
        </div>

        {loading ? (
          <div className="mt-12 flex h-40 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarDays size={30} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-900">
              No sessions found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your {tab.toLowerCase()} sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                currentUserId={user?._id || user?.id}
                updating={updatingId === session._id}
                onAccept={() => updateStatus(session._id, "accepted")}
                onReject={() => updateStatus(session._id, "rejected")}
                onSaveMeetingLink={(link) =>
                  handleUpdateMeetingLink(session._id, link)
                }
                onOpenChat={() => setActiveChatSession(session)}
                onOpenReview={() => setActiveReviewSession(session)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Real-time Chat Modal */}
      {activeChatSession && (
        <SessionChatModal
          session={activeChatSession}
          onClose={() => setActiveChatSession(null)}
        />
      )}

      {/* Review Modal */}
      {activeReviewSession && (
        <ReviewModal
          session={activeReviewSession}
          currentUserId={user?._id || user?.id}
          onClose={() => setActiveReviewSession(null)}
          onSuccess={fetchSessions}
        />
      )}
    </AppShell>
  );
}

function SessionCard({
  session,
  currentUserId,
  updating,
  onAccept,
  onReject,
  onSaveMeetingLink,
  onOpenChat,
  onOpenReview,
}) {
  const [editingLink, setEditingLink] = useState(false);
  const [linkInput, setLinkInput] = useState(session.meetingLink || "");

  const isMentor =
    session.mentor &&
    (session.mentor._id === currentUserId || session.mentor === currentUserId);

  const partner = isMentor ? session.requester : session.mentor;
  const partnerName = partner?.name || "Peer Student";
  const sessionType = isMentor ? "Teaching Request" : "Learning Session";

  const isAccepted = session.status === "accepted" || session.status === "completed";

  const statusDisplayMap = {
    pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
    accepted: { label: "Accepted (Upcoming)", className: "bg-indigo-50 text-indigo-600 border border-indigo-200" },
    completed: { label: "Completed", className: "bg-emerald-50 text-emerald-600 border border-emerald-200" },
    rejected: { label: "Rejected", className: "bg-red-50 text-red-500 border border-red-200" },
  };

  const currentStatus = statusDisplayMap[session.status] || {
    label: session.status,
    className: "bg-slate-100 text-slate-600",
  };

  const formattedDate = session.scheduledAt
    ? new Date(session.scheduledAt).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBD";

  const formattedTime = session.scheduledAt
    ? new Date(session.scheduledAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleSaveLink = () => {
    onSaveMeetingLink(linkInput);
    setEditingLink(false);
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarDays size={20} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-slate-900">
                {session.skill} Session
              </h2>

              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${currentStatus.className}`}
              >
                {currentStatus.label}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {sessionType} with{" "}
              <span className="font-semibold text-slate-700">{partnerName}</span>
            </p>

            {session.message && (
              <p className="mt-2 text-xs italic text-slate-600 bg-slate-50 p-2 rounded-lg">
                "{session.message}"
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} />
                {formattedDate}
              </span>

              {formattedTime && (
                <span className="flex items-center gap-1.5">
                  <Clock3 size={14} />
                  {formattedTime}
                </span>
              )}
            </div>

            {/* Google Meet Link Section for Accepted Sessions */}
            {isAccepted && (
              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                    <Video size={16} className="text-indigo-600 shrink-0" />
                    Google Meet:
                  </div>

                  {!editingLink && isMentor && (
                    <button
                      onClick={() => setEditingLink(true)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit2 size={12} />
                      {session.meetingLink ? "Edit Link" : "Add Link"}
                    </button>
                  )}
                </div>

                {editingLink && isMentor ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSaveLink}
                      disabled={updating}
                      className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      <Save size={13} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLink(false)}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                ) : session.meetingLink ? (
                  <div className="mt-1.5 flex items-center justify-between">
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs"
                    >
                      <Video size={14} />
                      Join Google Meet
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-slate-500 italic">
                    {isMentor
                      ? 'No Google Meet link added yet. Click "Add Link" above.'
                      : "Waiting for mentor to add Google Meet link."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {session.status === "pending" && isMentor && (
            <>
              <button
                onClick={onAccept}
                disabled={updating}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
              >
                {updating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Check size={16} />
                    Accept
                  </>
                )}
              </button>

              <button
                onClick={onReject}
                disabled={updating}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
              >
                {updating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <X size={16} />
                    Reject
                  </>
                )}
              </button>
            </>
          )}

          {session.status === "pending" && !isMentor && (
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-3 py-2 rounded-xl">
              Waiting for mentor response
            </span>
          )}

          {isAccepted && (
            <>
              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition"
              >
                <MessageCircle size={17} />
                Open Live Chat
              </button>

              <button
                onClick={onOpenReview}
                className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition"
              >
                <Star size={16} className="fill-amber-500 text-amber-500" />
                {session.status === "completed" ? "Edit Review" : "End & Review"}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}