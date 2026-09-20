import { useEffect, useState } from "react";
import {
  Map,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Plus,
  Compass,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { roadmapAPI } from "../services/api";

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [activeTab, setActiveTab] = useState("my-roadmaps"); // "my-roadmaps" | "generate"

  // Form State
  const [skill, setSkill] = useState("");
  const [currentLevel, setCurrentLevel] = useState("Beginner");
  const [goal, setGoal] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchRoadmaps = async () => {
    try {
      setLoadingRoadmaps(true);
      const res = await roadmapAPI.getRoadmaps();
      setRoadmaps(res.roadmaps || []);
      if (res.roadmaps && res.roadmaps.length > 0 && !selectedRoadmap) {
        setSelectedRoadmap(res.roadmaps[0]);
      }
    } catch (err) {
      console.error("Failed to load roadmaps:", err);
    } finally {
      setLoadingRoadmaps(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skill.trim() || !goal.trim()) {
      setError("Please specify both a skill and your learning goal.");
      return;
    }

    try {
      setError("");
      setGenerating(true);
      const res = await roadmapAPI.generateRoadmap({
        skill: skill.trim(),
        currentLevel,
        goal: goal.trim(),
      });

      if (res.roadmap) {
        setRoadmaps((prev) => [res.roadmap, ...prev]);
        setSelectedRoadmap(res.roadmap);
        setActiveTab("my-roadmaps");
        setSkill("");
        setGoal("");
      }
    } catch (err) {
      setError(err.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Map size={16} />
              Structured Learning Paths
            </div>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Skill Roadmaps
            </h1>
            <p className="mt-1 text-slate-500">
              Generate personalized step-by-step learning paths for any skill.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("my-roadmaps")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === "my-roadmaps"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              My Roadmaps ({roadmaps.length})
            </button>
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === "generate"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Plus size={16} />
              New Roadmap
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "generate" ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Map size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Generate Custom Roadmap
                </h2>
                <p className="text-xs text-slate-500">
                  Specify what skill you want to master.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Skill to Learn
                </label>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. React, Node.js, DSA, System Design, Cybersecurity"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Your Current Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="Beginner">Beginner (Little to no experience)</option>
                  <option value="Intermediate">Intermediate (Basic understanding)</option>
                  <option value="Advanced">Advanced (Looking for deep mastery)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Your Learning Goal
                </label>
                <textarea
                  rows="3"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Build full-stack web applications and land an internship."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating roadmap...
                  </>
                ) : (
                  <>
                    <Map size={18} />
                    Generate Roadmap
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8 grid gap-7 lg:grid-cols-12">
            {/* Sidebar list of roadmaps */}
            <div className="space-y-4 lg:col-span-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Saved Roadmaps
              </h2>

              {loadingRoadmaps ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-indigo-600" />
                </div>
              ) : roadmaps.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                  <FileText size={32} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No roadmaps generated yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Create your first structured learning plan.
                  </p>
                  <button
                    onClick={() => setActiveTab("generate")}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                  >
                    <Plus size={14} />
                    New Roadmap
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {roadmaps.map((rm) => (
                    <div
                      key={rm._id}
                      onClick={() => setSelectedRoadmap(rm)}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        selectedRoadmap?._id === rm._id
                          ? "border-indigo-500 bg-indigo-50/50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                          {rm.skill}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(rm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="mt-2 font-bold text-slate-900 line-clamp-1">
                        {rm.goal || `${rm.skill} Roadmap`}
                      </h3>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>Level: {rm.currentLevel}</span>
                        <span>{rm.steps?.length || 0} Stages</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main Roadmap Detailed View */}
            <div className="lg:col-span-8">
              {selectedRoadmap ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="border-b border-slate-100 pb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                        {selectedRoadmap.skill}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {selectedRoadmap.currentLevel} Level
                      </span>
                    </div>

                    <h2 className="mt-3 text-2xl font-bold text-slate-900">
                      {selectedRoadmap.goal}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Generated on {new Date(selectedRoadmap.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Stages */}
                  <div className="mt-8 space-y-6">
                    {selectedRoadmap.steps?.map((step, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                            {idx + 1}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {step.title}
                          </h3>
                          {step.duration && (
                            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                              <Clock size={13} />
                              {step.duration}
                            </span>
                          )}
                        </div>

                        {/* Topics */}
                        {step.topics && step.topics.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Topics to Cover
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {step.topics.map((topic, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                                >
                                  <CheckCircle2 size={13} className="text-emerald-500" />
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Project */}
                        {step.project && (
                          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 text-xs">
                            <span className="font-bold text-indigo-900">
                              Practical Project:{" "}
                            </span>
                            <span className="text-indigo-800">{step.project}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                  <Compass size={36} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 font-bold text-slate-700">
                    Select a roadmap to view details
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Or click "New Roadmap" above to generate one.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
