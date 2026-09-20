import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid college email.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <LockKeyhole size={20} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Welcome back
        </h1>

        <p className="mt-3 text-slate-500">
          Sign in to continue your learning journey.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            College Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              value={form.email}
              placeholder="you@college.edu"
              onChange={(e) => {
                setForm({
                  ...form,
                  email: e.target.value,
                });
                setError("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>

            <button
              type="button"
              className="text-xs font-semibold text-indigo-600"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              placeholder="Enter your password"
              onChange={(e) => {
                setForm({
                  ...form,
                  password: e.target.value,
                });
                setError("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            Remember me
          </label>

          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={14} />
            Secure login
          </span>
        </div>

        <button
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        <span className="font-bold">G</span>
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-slate-500">
        New to SkillSync?{" "}
        <Link to="/register" className="font-semibold text-indigo-600">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}