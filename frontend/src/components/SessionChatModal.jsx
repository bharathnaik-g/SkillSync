import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  X,
  Send,
  Loader2,
  MessageSquare,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { sessionAPI, getToken } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SessionChatModal({ session, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUserId = user?._id || user?.id;

  const partner =
    session.requester?._id === currentUserId || session.requester === currentUserId
      ? session.mentor
      : session.requester;

  const partnerName = partner?.name || "Peer Student";

  // Scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await sessionAPI.getMessages(session._id);
        setMessages(res.messages || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setError(err.message || "Failed to load chat history.");
      } finally {
        setLoading(false);
      }
    };

    if (session?._id) {
      fetchHistory();
    }
  }, [session]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = getToken();
    if (!token || !session?._id) return;

    const socket = io(API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join_room", { sessionId: session._id });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("room_joined", () => {
      console.log("Joined session room:", session._id);
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("error_message", (errMsg) => {
      setError(errMsg);
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socketRef.current) return;

    socketRef.current.emit("send_message", {
      sessionId: session._id,
      text: inputText.trim(),
    });

    setInputText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
              {partnerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">
                {partnerName}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span>{session.skill} Session</span>
                <span>·</span>
                {connected ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Real-time Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400">
                    <WifiOff size={12} />
                    Connecting...
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 size={28} className="animate-spin text-indigo-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <MessageSquare size={36} className="mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                No messages yet
              </p>
              <p className="text-xs">
                Start the conversation with {partnerName} for your {session.skill} session!
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const senderId =
                typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
              const isMe = senderId === currentUserId;
              const senderName =
                typeof msg.sender === "object" ? msg.sender?.name : "User";

              return (
                <div
                  key={msg._id || idx}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <span className="mb-1 px-1 text-[11px] text-slate-400">
                    {isMe ? "You" : senderName} ·{" "}
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-100"
                        : "bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-slate-100 p-4 bg-white flex gap-3 items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${partnerName}...`}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex items-center justify-center rounded-xl bg-indigo-600 p-3.5 text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
