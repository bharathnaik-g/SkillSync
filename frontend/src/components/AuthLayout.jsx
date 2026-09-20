import { BookOpen, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children, type = "login" }) {
  const register = type === "register";

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* Brand section */}
      <section className="relative hidden overflow-hidden bg-indigo-600 p-10 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between xl:p-14">

        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-900/50 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <BookOpen size={20} />
          </div>

          <span className="text-2xl font-bold">
            Skill<span className="text-indigo-200">Sync</span>
          </span>
        </div>

        <div className="relative z-10 max-w-xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-indigo-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Campus learning, reimagined
          </div>

          <h1 className="text-5xl font-bold leading-[1.08] xl:text-6xl">
            {register ? (
              <>
                Learn something.
                <br />
                <span className="text-indigo-200">
                  Teach something.
                </span>
              </>
            ) : (
              <>
                Learn from your campus.
                <br />
                <span className="text-indigo-200">
                  Share what you know.
                </span>
              </>
            )}
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-indigo-100">
            {register
              ? "Join your campus learning community and exchange knowledge with students around you."
              : "Connect with students who have the skills you want to learn while sharing what you already know."}
          </p>

          <div className="mt-10 space-y-4">

            <Feature text="Learn from students around you" />
            <Feature text="Share the skills you already know" />
            <Feature text="Build meaningful peer connections" />

          </div>
        </div>

        <p className="relative z-10 text-sm text-indigo-200">
          Connect. Learn. Exchange.
        </p>
      </section>

      {/* Form */}
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BookOpen size={18} />
            </div>

            <span className="text-2xl font-bold text-slate-900">
              Skill<span className="text-indigo-600">Sync</span>
            </span>
          </div>

          {children}

        </div>
      </section>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3 text-indigo-100">
      <CheckCircle2 size={18} />
      <span>{text}</span>
    </div>
  );
}