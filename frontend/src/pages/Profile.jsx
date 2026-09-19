import { useMemo, useState } from "react";
import {
  Camera,
  Check,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import AppShell from "../components/AppShell";

export default function Profile() {
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "Bharath Naik",
    email: "student@college.edu",
    department: "Information Science",
    semester: "5",
    bio: "Full stack developer interested in GenAI, cybersecurity and building useful products.",
    preference: "Online",
  });

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

  const completion = useMemo(() => {

    let score = 0;

    if (profile.name) score += 15;
    if (profile.department) score += 15;
    if (profile.semester) score += 10;
    if (profile.bio) score += 15;
    if (teachSkills.length) score += 15;
    if (learnSkills.length) score += 15;
    if (profile.preference) score += 15;

    return score;

  }, [profile, teachSkills, learnSkills]);

  const addSkill = (type) => {

    const value =
      type === "teach"
        ? newTeach.trim()
        : newLearn.trim();

    if (!value) return;

    const skill = {
      name: value,
      level: "Beginner",
    };

    if (type === "teach") {
      setTeachSkills([...teachSkills, skill]);
      setNewTeach("");
    } else {
      setLearnSkills([...learnSkills, skill]);
      setNewLearn("");
    }
  };

  const updateSkill = (
    type,
    index,
    key,
    value
  ) => {

    const list =
      type === "teach"
        ? [...teachSkills]
        : [...learnSkills];

    list[index] = {
      ...list[index],
      [key]: value,
    };

    type === "teach"
      ? setTeachSkills(list)
      : setLearnSkills(list);
  };

  const deleteSkill = (type, index) => {

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

  const saveProfile = () => {

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <AppShell>

      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-semibold text-indigo-600">
              Your identity
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Your Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Tell your campus what you know and want to learn.
            </p>

          </div>

          <div className="w-full sm:w-48">

            <div className="flex justify-between text-xs">

              <span className="font-medium text-slate-500">
                Profile completion
              </span>

              <span className="font-bold text-indigo-600">
                {completion}%
              </span>

            </div>

            <div className="mt-2 h-2 rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${completion}%` }}
              />

            </div>

          </div>

        </div>

        {saved && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Check size={17} />
            Profile saved successfully.
          </div>
        )}

        <div className="mt-7 space-y-6">

          {/* Basic */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center gap-4">

              <div className="relative">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                  B
                </div>

                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                  <Camera size={15} />
                </button>

              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your student profile up to date.
                </p>

              </div>

            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              <Input
                label="Full Name"
                value={profile.name}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    name: value,
                  })
                }
              />

              <Input
                label="College Email"
                value={profile.email}
                disabled
              />

              <Input
                label="Department"
                value={profile.department}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    department: value,
                  })
                }
              />

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Semester
                </label>

                <select
                  value={profile.semester}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      semester: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  {[1,2,3,4,5,6,7,8].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}th Semester
                    </option>
                  ))}
                </select>

              </div>

            </div>

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Bio
              </label>

              <textarea
                rows="4"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio: e.target.value,
                  })
                }
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </section>

          <SkillEditor
            title="Skills I Can Teach"
            description="Skills you're confident helping other students with."
            skills={teachSkills}
            input={newTeach}
            setInput={setNewTeach}
            add={() => addSkill("teach")}
            update={(i, key, value) =>
              updateSkill("teach", i, key, value)
            }
            remove={(i) =>
              deleteSkill("teach", i)
            }
          />

          <SkillEditor
            title="Skills I Want to Learn"
            description="Skills you want to learn from other students."
            skills={learnSkills}
            input={newLearn}
            setInput={setNewLearn}
            add={() => addSkill("learn")}
            update={(i, key, value) =>
              updateSkill("learn", i, key, value)
            }
            remove={(i) =>
              deleteSkill("learn", i)
            }
          />

          {/* Availability */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="font-bold text-slate-900">
              Availability
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Let students know when you're available.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
                <option>Saturday</option>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
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

            <div className="mt-6">

              <p className="mb-3 text-sm font-semibold text-slate-700">
                Session preference
              </p>

              <div className="flex flex-wrap gap-3">

                {["Online", "Offline", "Both"].map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() =>
                        setProfile({
                          ...profile,
                          preference: option,
                        })
                      }
                      className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition ${
                        profile.preference === option
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}

              </div>

            </div>

          </section>

          {/* Activity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="font-bold text-slate-900">
              Your Activity
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <Activity
                label="Average rating"
                value="4.8"
              />

              <Activity
                label="Completed sessions"
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
              onClick={saveProfile}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
            >
              <Save size={17} />
              Save Profile
            </button>

          </div>

        </div>

      </div>

    </AppShell>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 ${
          disabled ? "bg-slate-50 text-slate-400" : "bg-white"
        }`}
      />

    </div>
  );
}

function SkillEditor({
  title,
  description,
  skills,
  input,
  setInput,
  add,
  update,
  remove,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">

      <h2 className="font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-5 space-y-3">

        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex gap-3"
          >

            <input
              value={skill.name}
              onChange={(e) =>
                update(index, "name", e.target.value)
              }
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <select
              value={skill.level}
              onChange={(e) =>
                update(index, "level", e.target.value)
              }
              className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <button
              onClick={() => remove(index)}
              className="rounded-xl p-3 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={17} />
            </button>

          </div>
        ))}

        <div className="flex gap-3">

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Add another skill..."
            className="min-w-0 flex-1 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />

          <button
            onClick={add}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Add
          </button>

        </div>

      </div>

    </section>
  );
}

function Activity({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}