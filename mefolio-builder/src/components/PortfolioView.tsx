import React, { useState } from "react";
import { PortfolioData, Project } from "../types";
import DiscordProfile from "./DiscordProfile";
import Typewriter from "./Typewriter";
import { 
  Cpu, Terminal, Database, Smartphone, Globe, Code, Server, Layers,
  Github, Linkedin, Twitter, Mail, MapPin, Send, ExternalLink, Sparkles, Check, Info, Command
} from "lucide-react";

interface PortfolioViewProps {
  data: PortfolioData;
  isSplitView: boolean;
  onToggleView: () => void;
}

export default function PortfolioView({ data, isSplitView, onToggleView }: PortfolioViewProps) {
  // Map theme values to colors
  const themeMap = {
    indigo: {
      text: "text-indigo-400",
      bg: "bg-indigo-500",
      border: "border-indigo-500/20",
      borderHover: "hover:border-indigo-500/50",
      glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
      glowHeading: "shadow-[0_0_60px_rgba(99,102,241,0.08)]",
      gradient: "from-indigo-500 to-indigo-600",
      bulletGlow: "shadow-[0_0_8px_#6366f1]",
      hex: "#6366f1"
    },
    violet: {
      text: "text-violet-400",
      bg: "bg-violet-500",
      border: "border-violet-500/20",
      borderHover: "hover:border-violet-500/50",
      glow: "shadow-[0_0_20px_rgba(139,92,246,0.15)]",
      glowHeading: "shadow-[0_0_60px_rgba(139,92,246,0.08)]",
      gradient: "from-violet-500 to-violet-600",
      bulletGlow: "shadow-[0_0_8px_#8b5cf6]",
      hex: "#8b5cf6"
    },
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-500",
      border: "border-emerald-500/20",
      borderHover: "hover:border-emerald-500/50",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      glowHeading: "shadow-[0_0_60px_rgba(16,185,129,0.08)]",
      gradient: "from-emerald-500 to-emerald-600",
      bulletGlow: "shadow-[0_0_8px_#10b981]",
      hex: "#10b981"
    },
    rose: {
      text: "text-rose-400",
      bg: "bg-rose-500",
      border: "border-rose-500/20",
      borderHover: "hover:border-rose-500/50",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]",
      glowHeading: "shadow-[0_0_60px_rgba(244,63,94,0.08)]",
      gradient: "from-rose-500 to-rose-600",
      bulletGlow: "shadow-[0_0_8px_#f43f5e]",
      hex: "#f43f5e"
    },
    amber: {
      text: "text-amber-400",
      bg: "bg-amber-500",
      border: "border-amber-500/20",
      borderHover: "hover:border-amber-500/50",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
      glowHeading: "shadow-[0_0_60px_rgba(245,158,11,0.08)]",
      gradient: "from-amber-500 to-amber-600",
      bulletGlow: "shadow-[0_0_8px_#f59e0b]",
      hex: "#f59e0b"
    },
    cyan: {
      text: "text-cyan-400",
      bg: "bg-cyan-500",
      border: "border-cyan-500/20",
      borderHover: "hover:border-cyan-500/50",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      glowHeading: "shadow-[0_0_60px_rgba(6,182,212,0.08)]",
      gradient: "from-cyan-500 to-cyan-600",
      bulletGlow: "shadow-[0_0_8px_#06b6d4]",
      hex: "#06b6d4"
    }
  };

  const currentTheme = themeMap[data.themeColor] || themeMap.indigo;

  // Render correct SVG icon based on Project card settings
  const renderProjectIcon = (iconName: string) => {
    const pClasses = `h-5 w-5 ${currentTheme.text}`;
    switch (iconName) {
      case "Cpu":
        return <Cpu className={pClasses} />;
      case "Terminal":
        return <Terminal className={pClasses} />;
      case "Database":
        return <Database className={pClasses} />;
      case "Smartphone":
        return <Smartphone className={pClasses} />;
      case "Globe":
        return <Globe className={pClasses} />;
      case "Code":
        return <Code className={pClasses} />;
      case "Server":
        return <Server className={pClasses} />;
      case "Layers":
        return <Layers className={pClasses} />;
      default:
        return <Cpu className={pClasses} />;
    }
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Interactive Command Terminal Sandbox States
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: "input" | "output"; text: string }>>([
    { type: "output", text: "SYSTEM DIAGNOSTIC SHELL v1.4.2 ready." },
    { type: "output", text: "Run 'help' for possible interface options." }
  ]);

  const handleTerminalCmd = (rawCommand: string) => {
    const command = rawCommand.toLowerCase().trim();
    if (!command) return;

    let response = "";

    switch (command) {
      case "help":
        response = `Available Commands:
  • neofetch   - Render ASCII stats & profile data card
  • about      - View general system details & bio parameters
  • skills     - Check out available technology stack categories
  • projects   - Enumerate all active featured coding items
  • contact    - Reveal contact addresses & secure mail stream
  • clear      - Flush active screen history trace`;
        break;
      case "about":
        response = `System Bio Parameters:
  • Name: ${data.name}
  • Role: ${data.title}
  • BIO: ${data.bio}`;
        break;
      case "skills": {
        const skillsString = data.techCategories
          .map((cat) => `[${cat.name}] ${cat.skills.map((s) => s.name).join(", ")}`)
          .join("\n  • ");
        response = `Loaded Technology Framework stack list:\n  • ${skillsString}`;
        break;
      }
      case "projects": {
        const projectsString = data.projects
          .map((p) => `* ${p.title} - ${p.description}`)
          .join("\n  ");
        response = `Featured Project Repositories:\n  ${projectsString}`;
        break;
      }
      case "contact":
        response = `Communication direct access vectors:
  • Primary Email Desk: ${data.socials.email || "no-reply@server.org"}
  • GitHub Profile Link: ${data.socials.github || "Not Configured"}
  • LinkedIn Link Connection: ${data.socials.linkedin || "Not Configured"}`;
        break;
      case "clear":
        setTerminalHistory([]);
        return;
      case "neofetch":
        response = `   _   _          
  /_\\ | | ___ __  
 //_\\\\| |/ _ \\ \\/ /
/  _  \\ |  __/>  < 
\\_/ \\_/_|\\___/_/\\_\\ 
-------------------
USER: guest@mefolio
HOST: web-client-ingress
NAME: ${data.name}
ROLE: ${data.title}
DESK: ${data.location || "Remote - Planet Earth"}
DIAG: Operational & Sandbox link ready
THEM: ${data.themeColor.toUpperCase()}`;
        break;
      default:
        response = `Command not recognized: '${command}'. Type 'help' to see list of valid commands.`;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: "input", text: rawCommand },
      { type: "output", text: response }
    ]);
  };

  return (
    <div id="portfolio-viewer" className="relative flex flex-col min-h-full bg-[#050505] text-[#e5e7eb] overflow-x-hidden p-3.5 sm:p-6 md:p-8 select-none font-sans">
      {/* Glow decorative bubbles */}
      <div className={`absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full blur-[120px] opacity-[0.02] pointer-events-none ${currentTheme.bg}`} />
      <div className={`absolute bottom-[10%] right-[-10%] w-[45rem] h-[45rem] rounded-full blur-[130px] opacity-[0.02] pointer-events-none ${currentTheme.bg}`} />

      {/* Top Dock Navigation Header */}
      <header id="portfolio-header" className="relative w-full max-w-5xl mx-auto flex items-center justify-between px-4 py-2.5 border border-zinc-800 rounded-2xl bg-zinc-900/30 backdrop-blur-md mb-10 z-30">
        <div 
          onClick={() => handleScrollTo("portfolio-hero")}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs uppercase transition group-hover:scale-105 duration-200">
              {data.name.split(" ").map(n => n[0]).join("").slice(0, 2) || "AF"}
            </div>
          </div>
          <span className="font-medium tracking-tight text-white text-sm hidden sm:inline">{data.name.toLowerCase().replace(/\s+/g, "")}.folio</span>
        </div>

        {/* Anchor Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
          <button onClick={() => handleScrollTo("portfolio-about")} className="hover:text-white transition cursor-pointer">About</button>
          <button onClick={() => handleScrollTo("portfolio-projects")} className="hover:text-white transition cursor-pointer">Projects</button>
          <button onClick={() => handleScrollTo("portfolio-skills")} className="hover:text-white transition cursor-pointer">Tech Stack</button>
        </nav>

        {/* View Toggle Controller */}
        <button
          onClick={onToggleView}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800 text-[10px] font-mono tracking-wide text-zinc-300 font-semibold hover:text-white transition cursor-pointer"
        >
          <Command className="h-3 w-3" />
          <span>{isSplitView ? "Close Sandbox" : "Customize"}</span>
        </button>
      </header>

      {/* Main Content Scaffold */}
      <main id="portfolio-scaffold" className="flex-1 w-full max-w-5xl mx-auto space-y-8 pb-12 z-20">
        
        {/* HERO HERO SECTION as Bento Grid */}
        <section id="portfolio-hero" className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch pt-4">
          
          {/* Column A: Bento Intro Hero Card */}
          <div className="md:col-span-7 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group min-h-[360px] hover:border-zinc-700/60 transition duration-300">
            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 group-hover:opacity-20 transition duration-300 pointer-events-none">
              <Sparkles className="w-16 h-16 text-zinc-400 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Available for Hire</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white leading-none">
                Crafting Digital <br/> Experiences <span className="text-zinc-500">That Matter.</span>
              </h1>
              <p className="text-zinc-400 text-sm max-w-md font-sans">
                I'm <span className="text-white font-medium">{data.name}</span>, {data.title}.
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {/* Typewriter Rotator tagline */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3 px-4 flex items-center space-x-2.5 max-w-md shadow-inner">
                <Terminal className={`h-4 w-4 ${currentTheme.text} flex-shrink-0`} />
                <div className="text-xs text-zinc-250 font-mono leading-relaxed">
                  <Typewriter words={data.taglines} />
                </div>
              </div>

              {/* Biography Description */}
              <p className="text-zinc-400 text-[13px] leading-relaxed max-w-xl font-normal">
                {data.bio}
              </p>
            </div>

            {/* Social Connections Card integrated inside Hero block */}
            <div className="flex items-center gap-3 pt-6 border-t border-zinc-800/40 mt-6">
              {data.socials.github && (
                <a
                  href={data.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-zinc-800/80 flex items-center justify-center cursor-pointer transition text-zinc-400 hover:text-white"
                  title="GitHub Profile"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {data.socials.linkedin && (
                <a
                  href={data.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-zinc-800/80 flex items-center justify-center cursor-pointer transition text-zinc-400 hover:text-white"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {data.socials.twitter && (
                <a
                  href={data.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-zinc-800/80 flex items-center justify-center cursor-pointer transition text-zinc-400 hover:text-white"
                  title="Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {data.socials.email && (
                <a
                  href={`mailto:${data.socials.email}`}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-zinc-800/80 flex items-center justify-center cursor-pointer transition text-zinc-400 hover:text-white"
                  title="Contact Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column B: Lanyard Presence Widget Card + Location */}
          <div className="md:col-span-5 flex flex-col gap-4 justify-between h-full">
            <DiscordProfile discordId={data.discordId} simulateActive={false} />
            
            {/* Quick status details beneath */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] flex items-center space-x-3 text-xs hover:border-zinc-700/60 transition duration-300">
              <div className="w-8 h-8 rounded-full bg-zinc-800/60 border border-zinc-700 flex items-center justify-center text-zinc-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="font-mono text-[11px] text-zinc-400">
                Operating primarily from <span className="text-white font-semibold">{data.location || "Earth"}</span>
              </div>
            </div>
          </div>

        </section>

        {/* ABOUT / METRICS SECTION - Upgraded My Services Banner Card */}
        <section id="portfolio-about" className="pt-4">
          <div className={`${
            currentTheme.hex === "#6366f1" ? "bg-indigo-600 border-indigo-500" :
            currentTheme.hex === "#8b5cf6" ? "bg-violet-600 border-violet-500" :
            currentTheme.hex === "#10b981" ? "bg-emerald-600 border-emerald-500" :
            currentTheme.hex === "#f43f5e" ? "bg-rose-600 border-rose-500" :
            currentTheme.hex === "#f59e0b" ? "bg-amber-600 border-amber-500" : "bg-cyan-600 border-cyan-500"
          } rounded-[2rem] p-6 sm:p-8 text-white border relative flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden min-h-[140px] shadow-lg hover:brightness-105 transition duration-300 gap-6`}>
            <div className="text-4xl font-black opacity-10 absolute -right-3 -bottom-3 rotate-12 select-none text-[6rem] font-display pointer-events-none">DEV</div>
            <div className="space-y-2 max-w-sm">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-zinc-100/70 uppercase">My Services</h4>
              <p className="text-lg font-bold tracking-tight text-white font-sans">
                Premium engineering tailored for elegant and scalable interfaces.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 font-medium text-[12px] text-zinc-100 z-10">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> Web App Development</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> UI/UX Architecture</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> Real-time Discord Feeds</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> Optimization & Performance</li>
            </ul>
          </div>
        </section>

        {/* FEATURED PROJECTS BENTO SECTION */}
        <section id="portfolio-projects" className="space-y-4 pt-4">
          <div className="space-y-1 px-1">
            <h2 className="text-lg font-bold text-white tracking-tight font-display uppercase tracking-wider">Featured Projects</h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Innovative products, sandboxes and code utilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="relative overflow-hidden group bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700/60 transition duration-300 shadow-md min-h-[280px]"
              >
                {/* Subtle border outline decoration on hover */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${currentTheme.bg}`} />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl text-zinc-400">
                      {renderProjectIcon(proj.iconName)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-800/40 border border-zinc-800 hover:border-zinc-650 text-zinc-400 hover:text-white rounded-xl transition"
                          title="View Repository"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black cursor-pointer transition hover:scale-105 duration-200 shadow-sm"
                          title="Open Live Preview"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition duration-200 uppercase">
                      {proj.title}
                    </h3>
                    <p className="text-[13px] text-zinc-450 leading-relaxed font-normal">
                      {proj.description}
                    </p>
                  </div>
                </div>

                {/* Tags array */}
                <div className="flex flex-wrap gap-1.5 pt-6">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800/60 border border-zinc-750/70 font-mono text-[9px] text-zinc-350"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK / SKILLS SECTION */}
        <section id="portfolio-skills" className="space-y-4 pt-4">
          <div className="space-y-1 px-1">
            <h2 className="text-lg font-bold text-white tracking-tight font-display uppercase tracking-wider">Specialized Stack</h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Frameworks, languages, systems and devops tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.techCategories.map((c, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] flex flex-col justify-start space-y-4 hover:border-zinc-700/60 transition duration-300">
                <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800/70">
                  <span className={`h-1.5 w-1.5 rounded-full ${currentTheme.bg} ${currentTheme.glow}`} />
                  <h3 className="text-[11px] font-bold text-white uppercase font-mono tracking-widest">
                    {c.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span
                      key={s.name}
                      className="px-2.5 py-1 text-zinc-200 bg-zinc-800/30 border border-zinc-750 hover:border-zinc-700 rounded-xl text-[10px] font-mono font-medium transition duration-200 flex items-center space-x-1.5 group/skill"
                    >
                      <span className={`w-1 h-1 rounded-full ${currentTheme.bg} opacity-70 group-hover/skill:scale-125 transition-transform`} />
                      <span className="text-zinc-300">{s.name}</span>
                    </span>
                  ))}
                  {c.skills.length === 0 && (
                    <p className="text-[10px] text-zinc-650 font-mono italic">No items declared.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE TERMINAL / CONSOLE SYSTEM SANDBOX */}
        <section id="portfolio-terminal" className="space-y-4 pt-4">
          <div className="space-y-1 px-1">
            <h2 className="text-lg font-bold text-white tracking-tight font-display uppercase tracking-wider">Interactive Terminal</h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Query active parameters, run quick diagnostics, or execute command streams</p>
          </div>

          <div className="bg-black/85 border border-zinc-850 rounded-[2rem] p-5 sm:p-6 font-mono text-xs text-zinc-300 shadow-2xl relative overflow-hidden group hover:border-zinc-800 transition duration-300">
            {/* Header / Control Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4 text-zinc-500 select-none">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-zinc-600 pl-2">bash - guest@guestbook</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider text-zinc-650">
                Type 'help' to start
              </div>
            </div>

            {/* Terminal output logs area */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-zinc-800 leading-relaxed pr-2 font-mono">
              <div className="text-zinc-500 text-[11px]">=== MEFOLIO SYSTEM CONNECTED ===</div>
              <div className="text-zinc-500 text-[11px]">Device Link Stream Session: OK</div>
              <div className="text-zinc-400">Welcome. Use the quick action console buttons below or input text key commands.</div>

              {/* Stored commands output mapping */}
              {Array.isArray(terminalHistory) && terminalHistory.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap animate-fade-in text-[11px]">
                  {log.type === "input" ? (
                    <span className="text-zinc-500">
                      guest_stream@mefolio:~$ <span className="text-white font-medium">{log.text}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-300 block pl-2 border-l border-zinc-800 py-0.5">{log.text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick action helper chips for faster tap-to-trigger */}
            <div className="flex flex-wrap items-center gap-1.5 pb-4 border-t border-zinc-950 pt-3">
              <span className="text-[10px] text-zinc-600 mr-1 uppercase font-semibold">Shortcuts:</span>
              {[
                { name: "neofetch", cmd: "neofetch" },
                { name: "about", cmd: "about" },
                { name: "skills", cmd: "skills" },
                { name: "projects", cmd: "projects" },
                { name: "contact", cmd: "contact" },
                { name: "clear", cmd: "clear" }
              ].map((shortcut) => (
                <button
                  key={shortcut.name}
                  onClick={() => handleTerminalCmd(shortcut.cmd)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-[10px] text-zinc-400 hover:text-white cursor-pointer transition font-mono"
                >
                  {shortcut.name}
                </button>
              ))}
            </div>

            {/* Standard prompt entry line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!terminalInput.trim()) return;
                handleTerminalCmd(terminalInput.trim());
                setTerminalInput("");
              }}
              className="flex items-center space-x-2 bg-zinc-950/45 border border-zinc-900 rounded-xl p-2.5 focus-within:border-zinc-800 transition"
            >
              <span className={`${currentTheme.text} font-bold animate-pulse`}>&gt;</span>
              <input
                type="text"
                placeholder="Type terminal command here..."
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[11px] placeholder-zinc-700 focus:ring-0 p-0"
              />
              <span className="text-[9px] text-zinc-600 hidden sm:inline">[ENTER] to run</span>
            </form>
          </div>
        </section>

      </main>

      {/* Footer Design Credit Only - Matching Bento Bottom Bar */}
      <footer id="portfolio-footer" className="w-full max-w-5xl mx-auto border-t border-zinc-850/60 py-6 mt-16 z-25 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-2">
        <span className="uppercase">{data.name} © 2026</span>
        <span className="hidden md:inline uppercase">Built with precision and coffee</span>
        <span>v1.2.48</span>
      </footer>
    </div>
  );
}
