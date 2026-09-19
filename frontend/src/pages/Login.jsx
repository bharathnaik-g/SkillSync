import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* Left - Product Introduction */}
      <div className="hidden bg-indigo-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Skill<span className="text-indigo-200">Sync</span>
          </h1>
        </div>

        {/* Main message */}
        <div className="max-w-lg">

          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-indigo-200">
            Peer-to-peer learning
          </p>

          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Learn from your campus.
            <br />
            Share what you know.
          </h2>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-indigo-100">
            Connect with students who can teach the skills you want to
            learn — and share your own knowledge with others.
          </p>

          {/* Skill flow */}
          <div className="mt-10 flex items-center gap-3 text-sm font-medium">

            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              Java
            </span>

            <ArrowRight size={16} className="text-indigo-200" />

            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              DSA
            </span>

            <ArrowRight size={16} className="text-indigo-200" />

            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              Peer Learning
            </span>

          </div>

        </div>

        {/* Tagline */}
        <p className="text-sm text-indigo-200">
          Connect. Learn. Exchange.
        </p>

      </div>


      {/* Right - Login Form */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-10 lg:hidden">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-indigo-600">Sync</span>
            </h1>
          </div>


          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back 👋
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue your learning journey.
            </p>
          </div>


          {/* Form */}
          <form className="mt-8 space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                College Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@college.edu"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>


            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>


            {/* Login */}
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              Sign In
            </button>

          </form>


          {/* Divider */}
          <div className="my-7 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>


          {/* Google */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span className="text-base font-bold">G</span>
            Continue with Google
          </button>


          {/* Register */}
          <p className="mt-8 text-center text-sm text-slate-500">

            New to SkillSync?{" "}

            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create an account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}