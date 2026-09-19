import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please complete all fields.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid college email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* LEFT */}
      <section className="relative hidden overflow-hidden bg-indigo-600 p-12 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between xl:p-16">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Sparkles size={20} />
            </div>

            <span className="text-2xl font-bold">
              Skill<span className="text-indigo-200">Sync</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">

          <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-indigo-100">
            Your campus learning community
          </div>

          <h1 className="text-5xl font-bold leading-tight xl:text-6xl">
            Learn something.
            <br />
            <span className="text-indigo-200">
              Teach something.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-indigo-100">
            SkillSync makes it easy to find peers, exchange knowledge
            and grow together.
          </p>

          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">
              <CheckCircle2 size={19} />
              <span>Find students with the skills you need</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={19} />
              <span>Share the skills you already know</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={19} />
              <span>Learn through peer-to-peer sessions</span>
            </div>

          </div>
        </div>

        <p className="relative z-10 text-sm text-indigo-200">
          Connect. Learn. Exchange.
        </p>

      </section>

      {/* RIGHT */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">

        <div className="w-full max-w-md">

          <div className="mb-12 lg:hidden">
            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Sparkles size={18} />
              </div>

              <span className="text-2xl font-bold">
                Skill<span className="text-indigo-600">Sync</span>
              </span>

            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Create your account
          </h2>

          <p className="mt-3 text-slate-500">
            Join your campus and start exchanging skills.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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
                  placeholder="you@college.edu"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Use at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
            >
              Create Account

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
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

        </div>
      </section>
    </div>
  );
}