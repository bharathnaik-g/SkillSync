import { useState } from "react";
import { X, Star, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { sessionAPI } from "../services/api";

export default function ReviewModal({ session, currentUserId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isMentor =
    session.mentor &&
    (session.mentor._id === currentUserId || session.mentor === currentUserId);

  const partner = isMentor ? session.requester : session.mentor;
  const partnerName = partner?.name || "Peer Student";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await sessionAPI.submitReview(session._id, {
        rating,
        comment: comment.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Thank you for your feedback!
            </h3>
            <p className="text-sm text-slate-500">
              Your review for {partnerName} has been recorded.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-lg">
                {partnerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Rate & Review Session
                </h3>
                <p className="text-xs text-slate-500">
                  {session.skill} session with <span className="font-semibold">{partnerName}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Star Rating */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Session Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-slate-300 transition hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-700 text-sm">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* Feedback comment */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Feedback Review (Optional)
                </label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={`Share how your learning session with ${partnerName} went...`}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <Star size={16} />
                    Submit Review & Complete
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
