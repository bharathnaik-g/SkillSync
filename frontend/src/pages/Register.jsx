import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Loader2,
  Plus,
  X,
  Check,
  GraduationCap,
  Globe,
  Clock,
  Camera,
  Sparkles,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const PRESET_LEARN_SKILLS = [
  "React",
  "Python",
  "Java",
  "DSA",
  "Machine Learning",
  "Figma",
  "Node.js",
  "SQL",
  "Cybersecurity",
  "Flutter",
  "C++",
  "UI/UX",
];

const PRESET_TEACH_SKILLS = [
  "Java",
  "Python",
  "React",
  "DSA",
  "SQL",
  "Node.js",
  "UI/UX",
  "C++",
  "PyTorch",
  "Figma",
  "HTML/CSS",
  "IoT",
];

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256",
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Account
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "Computer Science",
    year: "5",
  });

  // Step 2: Learn
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [customLearn, setCustomLearn] = useState("");

  // Step 3: Teach
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [customTeach, setCustomTeach] = useState("");

  // Step 4: Availability
  const [availabilityMode, setAvailabilityMode] = useState("Online");
  const [availabilitySchedule, setAvailabilitySchedule] = useState("Flexible");

  // Step 5: Profile Photo
  const [profileImage, setProfileImage] = useState("");

  const passwordScore =
    form.password.length >= 10
      ? 3
      : form.password.length >= 8
      ? 2
      : form.password.length > 0
      ? 1
      : 0;

  const strengthText = ["", "Weak", "Good", "Strong"];

  // Toggle skills in list
  const toggleLearnSkill = (skill) => {
    setSkillsToLearn((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomLearnSkill = () => {
    const trimmed = customLearn.trim();
    if (trimmed && !skillsToLearn.includes(trimmed)) {
      setSkillsToLearn([...skillsToLearn, trimmed]);
      setCustomLearn("");
    }
  };

  const toggleTeachSkill = (skill) => {
    setSkillsToTeach((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomTeachSkill = () => {
    const trimmed = customTeach.trim();
    if (trimmed && !skillsToTeach.includes(trimmed)) {
      setSkillsToTeach([...skillsToTeach, trimmed]);
      setCustomTeach("");
    }
  };

  // Step 1 Validation
  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please complete all required fields.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setStep(2);
  };

  // Final Registration Submission
  const handleFinalSubmit = async (finalImage = profileImage) => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department,
        year: parseInt(form.year) || 1,
        skillsToLearn,
        skillsToTeach,
        availability: `${availabilityMode} (${availabilitySchedule})`,
        profileImage: finalImage,
      };

      await register(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="register">
      {/* Progress Stepper Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Step {step} of 5</span>
          <span className="text-indigo-600 font-bold">
            {step === 1 && "Account Info"}
            {step === 2 && "Skills to Learn"}
            {step === 3 && "Skills to Teach"}
            {step === 4 && "Availability"}
            {step === 5 && "Profile Photo"}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-start justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* STEP 1: Account Info */}
      {step === 1 && (
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-2 text-slate-500">
            Join your campus community and start exchanging skills.
          </p>

          <form onSubmit={handleStep1Next} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Full Name *
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={form.name}
                  placeholder="Enter your full name"
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                College Email *
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
                    setForm({ ...form, email: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password *
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  placeholder="Create password (min 8 chars)"
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
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
                  <p className="mt-1 text-xs text-slate-400">
                    Strength:{" "}
                    <span className="font-semibold text-slate-600">
                      {strengthText[passwordScore]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Department
                </label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Science">Information Science</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Electronics & Communication">Electronics & Comm.</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Eng.</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Semester
                </label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      {s}th Semester
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
            >
              Next: Skills to Learn
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600">
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* STEP 2: Skills to Learn */}
      {step === 2 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Sparkles size={16} /> Step 2 of 5
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            What skills do you want to learn?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Select or type skills so our matching engine can pair you with peer mentors.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
                Popular Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_LEARN_SKILLS.map((skill) => {
                  const selected = skillsToLearn.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleLearnSkill(skill)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {selected ? <Check size={14} /> : <Plus size={14} />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
                Add Custom Skill
              </p>
              <div className="flex gap-2">
                <input
                  value={customLearn}
                  onChange={(e) => setCustomLearn(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomLearnSkill();
                    }
                  }}
                  placeholder="e.g. Docker, Rust, Tailwind..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
                <button
                  type="button"
                  onClick={addCustomLearnSkill}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Add
                </button>
              </div>
            </div>

            {skillsToLearn.length > 0 && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="text-xs font-semibold text-indigo-900 mb-2">
                  Selected Skills ({skillsToLearn.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsToLearn.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm border border-indigo-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => toggleLearnSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-700 ml-1"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
              >
                Next: Skills to Teach <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Skills to Teach */}
      {step === 3 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <GraduationCap size={16} /> Step 3 of 5
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            What skills can you teach?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Share what you're good at so peer learners can reach out to you.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
                Popular Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_TEACH_SKILLS.map((skill) => {
                  const selected = skillsToTeach.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleTeachSkill(skill)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {selected ? <Check size={14} /> : <Plus size={14} />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
                Add Custom Skill
              </p>
              <div className="flex gap-2">
                <input
                  value={customTeach}
                  onChange={(e) => setCustomTeach(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTeachSkill();
                    }
                  }}
                  placeholder="e.g. System Design, Go, Next.js..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
                <button
                  type="button"
                  onClick={addCustomTeachSkill}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Add
                </button>
              </div>
            </div>

            {skillsToTeach.length > 0 && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-xs font-semibold text-emerald-900 mb-2">
                  Skills You Can Teach ({skillsToTeach.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsToTeach.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm border border-emerald-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => toggleTeachSkill(skill)}
                        className="text-emerald-400 hover:text-emerald-700 ml-1"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
              >
                Next: Availability <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Availability & Learning Mode */}
      {step === 4 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Clock size={16} /> Step 4 of 5
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            When & how are you available?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Set your preferred mode and timing for peer learning sessions.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
                Preferred Mode
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Online", label: "Online", desc: "Zoom / Meet", icon: Globe },
                  { id: "In-Person", label: "In-Person", desc: "Campus / Library", icon: GraduationCap },
                  { id: "Hybrid", label: "Hybrid", desc: "Both Mode", icon: Sparkles },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const active = availabilityMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setAvailabilityMode(mode.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition ${
                        active
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={20} className={active ? "text-indigo-600" : "text-slate-400"} />
                      <span className="mt-2 text-xs font-bold">{mode.label}</span>
                      <span className="text-[10px] text-slate-400">{mode.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
                Preferred Schedule
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Weekdays", label: "Weekdays", desc: "Mon - Fri" },
                  { id: "Weekends", label: "Weekends", desc: "Sat - Sun" },
                  { id: "Flexible", label: "Flexible", desc: "Anytime" },
                ].map((sched) => {
                  const active = availabilitySchedule === sched.id;
                  return (
                    <button
                      key={sched.id}
                      type="button"
                      onClick={() => setAvailabilitySchedule(sched.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition ${
                        active
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Clock size={18} className={active ? "text-indigo-600" : "text-slate-400"} />
                      <span className="mt-2 text-xs font-bold">{sched.label}</span>
                      <span className="text-[10px] text-slate-400">{sched.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
              >
                Next: Profile Photo <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Profile Photo & Finish */}
      {step === 5 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Camera size={16} /> Step 5 of 5
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Add a Profile Photo
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Pick an avatar or provide an image link to personalize your mentor profile.
          </p>

          <div className="mt-6 flex flex-col items-center">
            {/* Avatar Preview */}
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600 border-4 border-white shadow-md">
                  {form.name ? form.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            {/* Presets */}
            <p className="mt-5 text-xs font-semibold uppercase text-slate-400">
              Choose an Avatar
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {AVATAR_OPTIONS.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setProfileImage(imgUrl)}
                  className={`h-11 w-11 rounded-full overflow-hidden border-2 transition ${
                    profileImage === imgUrl
                      ? "border-indigo-600 ring-2 ring-indigo-200 scale-110"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`Avatar ${i}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Custom URL */}
            <div className="mt-5 w-full">
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Or paste image URL
              </label>
              <input
                value={profileImage}
                placeholder="https://example.com/avatar.jpg"
                onChange={(e) => setProfileImage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleFinalSubmit("")}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Not now / Skip
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleFinalSubmit()}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Complete Registration <Check size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}