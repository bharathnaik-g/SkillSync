import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  Save,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [teachSkills, setTeachSkills] = useState([
    { name: "Java", level: "Intermediate" },
    { name: "HTML", level: "Advanced" },
  ]);

  const [learnSkills, setLearnSkills] = useState([
    { name: "DSA", level: "Beginner" },
    { name: "React", level: "Beginner" },
  ]);

  const [newTeach, setNewTeach] = useState("");
  const [newLearn, setNewLearn] = useState("");

  const addSkill = (type) => {
    const value = type === "teach" ? newTeach : newLearn;

    if (!value.trim()) return;

    if (type === "teach") {
      setTeachSkills([
        ...teachSkills,
        { name: value, level: "Beginner" },
      ]);
      setNewTeach("");
    } else {
      setLearnSkills([
        ...learnSkills,
        { name: value, level: "Beginner" },
      ]);
      setNewLearn("");
    }
  };

  const removeSkill = (type, index) => {
    if (type === "teach") {
      setTeachSkills(
        teachSkills.filter((_, i) => i !== index)
      );
    } else {
      setLearnSkills(
        learnSkills.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <Link to="/dashboard" className="text-xl font-bold">
            Skill<span className="text-indigo-600">Sync</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

        </div>

      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">

        <div className="mb-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold text-indigo-600">
                Your identity
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Your Profile
              </h1>

              <p className="mt-2 text-slate-500">
                Help other students understand what you know and want to learn.
              </p>

            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-medium text-slate-400">
                Profile completion
              </p>

              <p className="mt-1 text-2xl font-bold text-indigo-600">
                75%
              </p>
            </div>

          </div>

        </div>

        <div className="space-y-6">

          {/* PERSONAL */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center gap-5">

              <div className="relative">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                  B
                </div>

                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow">
                  <Camera size={15} />
                </button>

              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your basic information is visible to other students.
                </p>
              </div>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <Field
                label="Full Name"
                value="Bharath Naik"
              />

              <Field
                label="College Email"
                value="student@college.edu"
                disabled
              />

              <Field
                label="Department"
                value="Information Science"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Semester
                </label>

                <select
                  defaultValue="5"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>

            </div>

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                About You
              </label>

              <textarea
                rows="4"
                defaultValue="Full stack developer interested in GenAI, cybersecurity and building useful products."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </section>

          {/* SKILLS */}
          <SkillSection
            title="Skills I Can Teach"
            description="Skills you can help other students learn."
            skills={teachSkills}
            value={newTeach}
            setValue={setNewTeach}
            onAdd={() => addSkill("teach")}
            onRemove={(i) => removeSkill("teach", i)}
            onChange={setTeachSkills}
          />

          <SkillSection
            title="Skills I Want to Learn"
            description="Skills you want to learn from your peers."
            skills={learnSkills}
            value={newLearn}
            setValue={setNewLearn}
            onAdd={() => addSkill("learn")}
            onRemove={(i) => removeSkill("learn", i)}
            onChange={setLearnSkills}
          />

          {/* AVAILABILITY */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Availability
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tell students when you are usually available.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <option>Saturday</option>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>

              <input
                type="time"
                defaultValue="10:00"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />

              <input
                type="time"
                defaultValue="12:00"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />

            </div>

            <div className="mt-5">

              <p className="mb-3 text-sm font-semibold text-slate-700">
                Session preference
              </p>

              <div className="flex flex-wrap gap-5">

                {["Online", "Offline", "Both"].map((option, i) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <input
                      type="radio"
                      name="preference"
                      defaultChecked={i === 0}
                    />
                    {option}
                  </label>
                ))}

              </div>

            </div>

          </section>

          {/* ACTIVITY */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Learning Activity
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <Activity
                label="Rating"
                value="4.8"
                icon={<Star size={18} />}
              />

              <Activity
                label="Sessions completed"
                value="12"
              />

              <Activity
                label="Skills exchanged"
                value="18"
              />

            </div>

          </section>

          <div className="flex justify-end">

            <button
              onClick={() => alert("Profile saved!")}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
            >
              <Save size={17} />
              Save Profile
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

function Field({ label, value, disabled }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        defaultValue={value}
        disabled={disabled}
        className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 ${
          disabled ? "bg-slate-50 text-slate-400" : "bg-white"
        }`}
      />
    </div>
  );
}

function SkillSection({
  title,
  description,
  skills,
  value,
  setValue,
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">

      <h2 className="text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-5 space-y-3">

        {skills.map((skill, index) => (
          <div key={index} className="flex gap-3">

            <input
              value={skill.name}
              onChange={(e) => {
                const updated = [...skills];
                updated[index].name = e.target.value;
                onChange(updated);
              }}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <select
              value={skill.level}
              onChange={(e) => {
                const updated = [...skills];
                updated[index].level = e.target.value;
                onChange(updated);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <button
              onClick={() => onRemove(index)}
              className="rounded-xl p-3 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={17} />
            </button>

          </div>
        ))}

        <div className="flex gap-3">

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdd();
              }
            }}
            placeholder="Add a skill..."
            className="flex-1 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />

          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Add
          </button>

        </div>

      </div>

    </section>
  );
}

function Activity({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">

      <div className="flex items-center gap-2 text-indigo-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}