import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const passwordScore =
    form.password.length >= 10
      ? 3
      : form.password.length >= 6
      ? 2
      : form.password.length > 0
      ? 1
      : 0;

  const strengthText = ["", "Weak", "Good", "Strong"];

  const submit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please complete all fields.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid college email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 900);
  };

  return (
    <AuthLayout type="register">

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        Create your account
      </h1>

      <p className="mt-3 text-slate-500">
        Join your campus and start exchanging skills.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-8 space-y-5"
      >

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={form.name}
              placeholder="Enter your full name"
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />

          </div>
        </div>

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
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />

          </div>
        </div>

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <div className="relative">

            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              placeholder="Create a password"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          {form.password && (
            <div className="mt-3">

              <div className="flex gap-1">

                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full ${
                      level <= passwordScore
                        ? "bg-indigo-500"
                        : "bg-slate-200"
                    }`}
                  />
                ))}

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Password strength:{" "}
                <span className="font-semibold text-slate-600">
                  {strengthText[passwordScore]}
                </span>
              </p>

            </div>
          )}

        </div>

        <button
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}

          {!loading && (
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
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
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600"
        >
          Sign in
        </Link>
      </p>

    </AuthLayout>
  );
}