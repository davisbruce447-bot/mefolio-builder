import { useState, useTransition } from "react";
import { PortfolioData, Project, TechCategory, SocialLinks } from "../types";
import { 
  Sparkles, Sliders, User, MessageSquare, Compass, List, 
  Link, Layout, Palette, RefreshCw, Trash2, Plus, Check, Play, AlertCircle
} from "lucide-react";

interface CustomizerProps {
  data: PortfolioData;
  onChange: (updated: PortfolioData) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (content: string) => void;
  adminPassword: string;
  onPasswordChange: (newPass: string) => void;
}

export default function Customizer({ 
  data, 
  onChange, 
  onReset, 
  onExport, 
  onImport,
  adminPassword,
  onPasswordChange
}: CustomizerProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "taglines" | "projects" | "skills" | "theme">("profile");
  
  const [importText, setImportText] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const handleBasicsChange = (key: keyof PortfolioData, value: any) => {
    onChange({ ...data, [key]: value });
  };

  const handleSocialsChange = (key: keyof SocialLinks, value: string) => {
    onChange({
      ...data,
      socials: { ...data.socials, [key]: value }
    });
  };

  // Taglines
  const [newTagline, setNewTagline] = useState("");
  const addTagline = () => {
    if (!newTagline.trim()) return;
    onChange({
      ...data,
      taglines: [...data.taglines, newTagline.trim()]
    });
    setNewTagline("");
  };

  const removeTagline = (index: number) => {
    const next = [...data.taglines];
    next.splice(index, 1);
    onChange({ ...data, taglines: next });
  };

  // Projects
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(data.projects[0]?.id || null);
  const activeProject = data.projects.find(p => p.id === selectedProjectId) || data.projects[0];

  const handleProjectChange = (projectId: string, key: keyof Project, value: any) => {
    const updated = data.projects.map((p) => {
      if (p.id === projectId) {
        if (key === "tags" && typeof value === "string") {
          return { ...p, tags: value.split(",").map(t => t.trim()).filter(Boolean) };
        }
        return { ...p, [key]: value };
      }
      return p;
    });
    onChange({ ...data, projects: updated });
  };

  const addProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      title: "New Interactive Project",
      description: "Describe your custom software project details and core algorithms built with modern technologies here.",
      tags: ["React", "TypeScript", "Vite"],
      githubUrl: "https://github.com",
      demoUrl: "https://devwood.io",
      iconName: "Cpu"
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj]
    });
    setSelectedProjectId(newProj.id);
  };

  const removeProject = (id: string) => {
    if (data.projects.length <= 1) return; // Maintain at least one
    const updated = data.projects.filter(p => p.id !== id);
    onChange({ ...data, projects: updated });
    setSelectedProjectId(updated[0]?.id || null);
  };

  // Tech Skills
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number>(0);
  const activeCategory = data.techCategories[selectedCategoryIdx];

  const handleCategoryNameChange = (idx: number, newName: string) => {
    const updated = data.techCategories.map((c, i) => {
      if (i === idx) return { ...c, name: newName };
      return c;
    });
    onChange({ ...data, techCategories: updated });
  };

  const [newSkillName, setNewSkillName] = useState("");
  const addSkill = (catIdx: number) => {
    if (!newSkillName.trim()) return;
    const updated = data.techCategories.map((c, i) => {
      if (i === catIdx) {
        return {
          ...c,
          skills: [...c.skills, { name: newSkillName.trim() }]
        };
      }
      return c;
    });
    onChange({ ...data, techCategories: updated });
    setNewSkillName("");
  };

  const removeSkill = (catIdx: number, skillName: string) => {
    const updated = data.techCategories.map((c, i) => {
      if (i === catIdx) {
        return {
          ...c,
          skills: c.skills.filter(s => s.name !== skillName)
        };
      }
      return c;
    });
    onChange({ ...data, techCategories: updated });
  };

  const addCategory = () => {
    const newCat: TechCategory = {
      name: "New Tech Section",
      skills: [{ name: "Skill A" }, { name: "Skill B" }]
    };
    onChange({
      ...data,
      techCategories: [...data.techCategories, newCat]
    });
    setSelectedCategoryIdx(data.techCategories.length);
  };

  const removeCategory = (idx: number) => {
    if (data.techCategories.length <= 1) return;
    const updated = data.techCategories.filter((_, i) => i !== idx);
    onChange({ ...data, techCategories: updated });
    setSelectedCategoryIdx(0);
  };



  const colors = [
    { value: "indigo", label: "Midnight Indigo", class: "bg-indigo-500" },
    { value: "violet", label: "Electric Violet", class: "bg-violet-500" },
    { value: "emerald", label: "Jade Emerald", class: "bg-emerald-500" },
    { value: "rose", label: "Cyber Rose", class: "bg-rose-500" },
    { value: "amber", label: "Forge Amber", class: "bg-amber-500" },
    { value: "cyan", label: "Holographic Cyan", class: "bg-cyan-500" },
  ];

  return (
    <div id="customizer-panel" className="bg-[#0b0b0c] border border-zinc-800 rounded-[2rem] p-6 flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
        <div className="flex items-center space-x-2.5">
          <Sliders className="h-5 w-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight font-display">Portfolio Customizer</h2>
            <p className="text-[11px] text-zinc-400 font-mono">Tailor your mefolio experience</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/45 text-xs text-zinc-300 font-mono hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex space-x-1 p-0.5 bg-neutral-950/60 rounded-xl mb-5 text-[11px] font-semibold border border-zinc-800 font-mono">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 flex items-center justify-center space-x-1 py-2 px-1 rounded-lg transition capitalize cursor-pointer ${
            activeTab === "profile" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/40" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <User className="h-3 w-3" />
          <span className="hidden sm:inline">Basics</span>
        </button>
        <button
          onClick={() => setActiveTab("taglines")}
          className={`flex-1 flex items-center justify-center space-x-1 py-2 px-1 rounded-lg transition capitalize cursor-pointer ${
            activeTab === "taglines" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/40" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <MessageSquare className="h-3 w-3" />
          <span className="hidden sm:inline">Taglines</span>
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex-1 flex items-center justify-center space-x-1 py-2 px-1 rounded-lg transition capitalize cursor-pointer ${
            activeTab === "projects" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/40" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layout className="h-3 w-3" />
          <span className="hidden sm:inline">Projects</span>
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex-1 flex items-center justify-center space-x-1 py-2 px-1 rounded-lg transition capitalize cursor-pointer ${
            activeTab === "skills" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/40" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <List className="h-3 w-3" />
          <span className="hidden sm:inline">Skills</span>
        </button>
        <button
          onClick={() => setActiveTab("theme")}
          className={`flex-1 flex items-center justify-center space-x-1 py-2 px-1 rounded-lg transition capitalize cursor-pointer ${
            activeTab === "theme" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/40" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Palette className="h-3 w-3" />
          <span className="hidden sm:inline">Theme</span>
        </button>
      </div>

      {/* Tab Contents - Scrollable Box */}
      <div id="customizer-scroller" className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs select-none">
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200 font-mono tracking-tight pb-1 border-b border-slate-800">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono mb-1.5">FullName</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => handleBasicsChange("name", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1.5">Avatar Graphic URL</label>
                <input
                  type="text"
                  value={data.avatarUrl}
                  onChange={(e) => handleBasicsChange("avatarUrl", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5">Professional Subtitle</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleBasicsChange("title", e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono mb-1.5">Location</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => handleBasicsChange("location", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1.5">Discord ID (Numerical)</label>
                <input
                  type="text"
                  value={data.discordId}
                  onChange={(e) => handleBasicsChange("discordId", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="e.g. 747833"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5">Social URLs</label>
              <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={data.socials.github || ""}
                  onChange={(e) => handleSocialsChange("github", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono"
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={data.socials.linkedin || ""}
                  onChange={(e) => handleSocialsChange("linkedin", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono"
                />
                <input
                  type="text"
                  placeholder="Twitter / X URL"
                  value={data.socials.twitter || ""}
                  onChange={(e) => handleSocialsChange("twitter", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono"
                />
                <input
                  type="text"
                  placeholder="Contact Email"
                  value={data.socials.email || ""}
                  onChange={(e) => handleSocialsChange("email", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5">Biography</label>
              <textarea
                value={data.bio}
                onChange={(e) => handleBasicsChange("bio", e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {activeTab === "taglines" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200 font-mono tracking-tight pb-1 border-b border-slate-800">Hero Taglines</h3>
            <p className="text-[10px] text-slate-400">These phrases rotate sequentially in the typewriter effect at the header.</p>
            
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {data.taglines.map((tag, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-slate-950 border border-slate-850 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                  <p className="flex-1 text-slate-300 pr-2">{tag}</p>
                  <button
                    onClick={() => removeTagline(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add smart rotating tagline..."
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTagline()}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200"
              />
              <button
                onClick={addTagline}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 rounded-xl flex items-center justify-center cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h3 className="font-semibold text-slate-200 font-mono tracking-tight">Project Cards</h3>
              <button
                onClick={addProject}
                className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-mono text-[10px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Project</span>
              </button>
            </div>

            {/* List selector */}
            <div className="flex space-x-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-850 overflow-x-auto">
              {data.projects.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-mono capitalize transition cursor-pointer ${
                    activeProject?.id === p.id 
                      ? "bg-slate-800 text-slate-200" 
                      : "text-slate-550 hover:bg-slate-900 hover:text-slate-400"
                  }`}
                >
                  Project {i + 1}
                </button>
              ))}
            </div>

            {activeProject ? (
              <div className="space-y-3.5 bg-slate-950/20 p-3.5 border border-slate-850 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">ID: {activeProject.id.slice(0, 8)}...</span>
                  <button
                    onClick={() => removeProject(activeProject.id)}
                    className="flex items-center space-x-1 text-rose-500 hover:bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Project Title</label>
                  <input
                    type="text"
                    value={activeProject.title}
                    onChange={(e) => handleProjectChange(activeProject.id, "title", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Icon Vector</label>
                    <select
                      value={activeProject.iconName}
                      onChange={(e) => handleProjectChange(activeProject.id, "iconName", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2 py-1.5 text-slate-200 font-mono text-[10px]"
                    >
                      <option value="Cpu">Cpu Chip</option>
                      <option value="Terminal">Terminal</option>
                      <option value="Database">Database</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Globe">Globe / Web</option>
                      <option value="Code">Braces Code</option>
                      <option value="Server">Server Rack</option>
                      <option value="Layers">Layers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Tags (Comma Sep.)</label>
                    <input
                      type="text"
                      value={activeProject.tags.join(", ")}
                      onChange={(e) => handleProjectChange(activeProject.id, "tags", e.target.value)}
                      placeholder="React, Redis, Rust"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-200 font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">GitHub Link</label>
                    <input
                      type="text"
                      value={activeProject.githubUrl || ""}
                      onChange={(e) => handleProjectChange(activeProject.id, "githubUrl", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-200 font-mono text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Demo / Deploy Link</label>
                    <input
                      type="text"
                      value={activeProject.demoUrl || ""}
                      onChange={(e) => handleProjectChange(activeProject.id, "demoUrl", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-200 font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Description Code/Concept</label>
                  <textarea
                    value={activeProject.description}
                    onChange={(e) => handleProjectChange(activeProject.id, "description", e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-200"
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h3 className="font-semibold text-slate-200 font-mono tracking-tight">Tech Stack List</h3>
              <button
                onClick={addCategory}
                className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-mono text-[10px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Tech Block</span>
              </button>
            </div>

            {/* Section tabs */}
            <div className="flex space-x-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-850 overflow-x-auto">
              {data.techCategories.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategoryIdx(i)}
                  className={`flex-shrink-0 px-2.5 py-1 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer ${
                    selectedCategoryIdx === i 
                      ? "bg-slate-850 text-slate-200" 
                      : "text-slate-500 hover:bg-slate-900 hover:text-slate-400"
                  }`}
                >
                  {c.name || `Section ${i + 1}`}
                </button>
              ))}
            </div>

            {activeCategory ? (
              <div className="space-y-3.5 bg-slate-950/20 p-3.5 border border-slate-850 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Customize Subsection</span>
                  <button
                    onClick={() => removeCategory(selectedCategoryIdx)}
                    className="flex items-center space-x-1 text-rose-500 hover:bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete Block</span>
                  </button>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Block Title</label>
                  <input
                    type="text"
                    value={activeCategory.name}
                    onChange={(e) => handleCategoryNameChange(selectedCategoryIdx, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Active Badges</label>
                  <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-850 min-h-16">
                    {activeCategory.skills.map((s) => (
                      <span
                        key={s.name}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-350"
                      >
                        <span>{s.name}</span>
                        <button
                          onClick={() => removeSkill(selectedCategoryIdx, s.name)}
                          className="text-slate-550 hover:text-white transition font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {activeCategory.skills.length === 0 && (
                      <p className="text-[10px] text-slate-600 font-mono my-auto">No items in stack</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="New skill (e.g. Postgres)..."
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill(selectedCategoryIdx)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-200 text-[10px] font-mono"
                  />
                  <button
                    onClick={() => addSkill(selectedCategoryIdx)}
                    className="bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-1.5 rounded-xl font-mono text-[10px] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === "theme" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200 font-mono tracking-tight pb-1 border-b border-slate-800">Visual Themes</h3>
            
            <div>
              <label className="block text-slate-450 font-mono mb-2">Accent Aura Color</label>
              <div className="grid grid-cols-2 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleBasicsChange("themeColor", c.value)}
                    className={`flex items-center space-x-2 p-2.5 border rounded-xl hover:bg-slate-950/40 text-left transition cursor-pointer ${
                      data.themeColor === c.value 
                        ? "border-indigo-500/80 bg-slate-950/70" 
                        : "border-slate-850 bg-slate-950/20"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${c.class}`} />
                    <span className="text-[11px] text-slate-200 font-mono">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-450 font-mono mb-2">Constellation Stars Count ({data.constellationDensity})</label>
              <input
                type="range"
                min="20"
                max="140"
                step="5"
                value={data.constellationDensity}
                onChange={(e) => handleBasicsChange("constellationDensity", parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-550 mt-1">
                <span>Minimal drift</span>
                <span>Rich connection network</span>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-slate-200 font-mono tracking-tight pb-1 border-b border-slate-800 mb-2">Backup & Configuration</h3>
              <div className="flex gap-2">
                <button
                  onClick={onExport}
                  className="flex-1 py-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 font-mono hover:text-white hover:bg-slate-950/50 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Export JSON</span>
                </button>
              </div>
              <div className="mt-3.5 space-y-2">
                <label className="block text-slate-450 font-mono">Import profile JSON config</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder='Paste raw JSON here and click Import...'
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-400 font-mono text-[9px]"
                  />
                  <button
                    onClick={() => {
                      if(importText.trim()) {
                        onImport(importText);
                        setImportText("");
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-xl font-mono text-[10px] cursor-pointer"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>

            {/* Customizer Security key section */}
            <div className="pt-2 border-t border-slate-800/80 mt-4">
              <h3 className="font-semibold text-slate-200 font-mono tracking-tight pb-1 border-b border-slate-800 mb-2">Access Security</h3>
              <div className="space-y-2">
                <label className="block text-slate-450 font-mono">Administrative Customizer Password</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter new password code"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (!tempPassword.trim()) {
                        alert("Security key cannot be blank.");
                        return;
                      }
                      onPasswordChange(tempPassword.trim());
                      setTempPassword("");
                    }}
                    className="bg-white hover:bg-zinc-200 text-black px-3.5 py-1.5 rounded-xl font-mono text-[10px] font-semibold cursor-pointer transition border border-transparent"
                  >
                    Update
                  </button>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-550 mt-1">
                  <span>Secure sandbox unlock key</span>
                  <span className="text-zinc-450">Active: {"•".repeat(adminPassword.length)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
