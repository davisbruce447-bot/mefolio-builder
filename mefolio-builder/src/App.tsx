import { useState, useEffect } from "react";
import { PortfolioData, DEFAULT_PORTFOLIO } from "./types";
import Constellation from "./components/Constellation";
import Customizer from "./components/Customizer";
import PortfolioView from "./components/PortfolioView";
import { 
  Sparkles, Code, ArrowRightLeft, Copy, Download, RefreshCw, 
  Settings, Info, Sliders, CheckSquare, Eye, Play, Check, AlertTriangle
} from "lucide-react";

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(DEFAULT_PORTFOLIO);
  const [isSplitView, setIsSplitView] = useState(false);
  const [activeTabMobile, setActiveTabMobile] = useState<"edit" | "preview">("preview");

  // Administrative Access Credentials
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem("mefolio-admin-password") || "admin";
    } catch (_) {
      return "admin";
    }
  });

  const handlePasswordChange = (newPassword: string) => {
    setAdminPassword(newPassword);
    try {
      localStorage.setItem("mefolio-admin-password", newPassword);
    } catch (e) {
      console.warn("Could not write password to local storage:", e);
    }
    showToast("Administrative secure password passcode updated!");
  };
  
  // Notification States
  const [toastMessage, setToastMessage] = useState("");
  const [copiedConfig, setCopiedConfig] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mefolio-builder-config");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic schema check
        if (parsed.name && parsed.projects && parsed.techCategories) {
          setPortfolioData(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not read local storage values:", e);
    }
  }, []);

  // Update localStorage and state
  const handlePortfolioChange = (updated: PortfolioData) => {
    setPortfolioData(updated);
    try {
      localStorage.setItem("mefolio-builder-config", JSON.stringify(updated));
    } catch (e) {
      console.error("Could not write local storage values:", e);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore the default portfolio? Your local changes will be replaced.")) {
      handlePortfolioChange(DEFAULT_PORTFOLIO);
      showToast("Config reset to defaults successfully!");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Export config (copies to clipboard + prompts file download)
  const handleExport = () => {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    
    // Copy to clipboard
    navigator.clipboard.writeText(dataStr).then(() => {
      showToast("Settings JSON copied to clipboard automatically!");
    }).catch(err => {
      console.warn("Clipboard access denied:", err);
    });

    // Download trigger
    try {
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${portfolioData.name.toLowerCase().replace(/\s+/g, "_")}_mefolio_config.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn("Mock anchor download prevented in frame. Fallback active.", e);
    }
  };

  // Import config parser
  const handleImport = (contentStr: string) => {
    try {
      const parsed = JSON.parse(contentStr);
      if (!parsed.name || !parsed.projects || !parsed.techCategories) {
        alert("Payload structure invalid! Check fields: name, projects, and techCategories must exist.");
        return;
      }
      handlePortfolioChange(parsed as PortfolioData);
      showToast(`Welcome back! Imported settings for '${parsed.name}' successfully.`);
    } catch (e) {
      alert("Malformed JSON string entered. Double-check your copied parameters.");
    }
  };

  // Admin password states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleVerifyPassword = () => {
    if (passwordInput === adminPassword) {
      setIsSplitView(true);
      setIsPasswordModalOpen(false);
      setPasswordInput("");
      showToast("Access granted. Portfolio Customizer activated!");
    } else {
      setPasswordError("Invalid key. Please try again.");
    }
  };

  // Toggle view with security lock
  const handleToggleView = () => {
    if (isSplitView) {
      setIsSplitView(false);
      showToast("Customizer sandbox closed and locked.");
    } else {
      setIsPasswordModalOpen(true);
      setPasswordInput("");
      setPasswordError("");
    }
  };

  // Map theme colors to Hex values for Constellation background
  const themeHexMap = {
    indigo: "#6366f1",
    violet: "#8b5cf6",
    emerald: "#10b981",
    rose: "#f43f5e",
    amber: "#f59e0b",
    cyan: "#06b6d4"
  };

  const currentThemeHex = themeHexMap[portfolioData.themeColor] || "#6366f1";

  // Quick inject custom css variables for brand colors
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', currentThemeHex);
  }, [currentThemeHex]);

  return (
    <div id="mefolio-root" className="relative w-screen h-screen overflow-hidden bg-[#050505] font-sans text-[#e5e7eb] flex flex-col antialiased">
      
      {/* Background Interactive Star System */}
      <Constellation 
        density={portfolioData.constellationDensity} 
        themeColor={currentThemeHex} 
      />

      {/* Floating Global Micro-Toast Notification */}
      {toastMessage && (
        <div 
          id="global-toast" 
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 border border-zinc-800 p-3 px-5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-2 animate-[bounce_1s] text-xs font-mono text-zinc-300"
        >
          <Sparkles className="h-4 w-4 animate-spin text-zinc-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile-Only Tab Controls Hidden */}

      {/* Layout Content Wrapper */}
      <div id="layout-scaffolding" className="flex-1 flex overflow-hidden w-full h-full">
        
        {/* DESKTOP SPLIT / MOBILE ACTIVE EDIT TAB */}
        <div 
          id="customizer-dock"
          className={`${
            isSplitView ? "hidden md:block w-[360px] lg:w-[420px] xl:w-[440px]" : "hidden"
          } ${
            activeTabMobile === "edit" ? "block w-full md:block" : ""
          } flex-shrink-0 border-r border-zinc-800 p-4 h-full`}
        >
          <Customizer
            data={portfolioData}
            onChange={handlePortfolioChange}
            onReset={handleReset}
            onExport={handleExport}
            onImport={handleImport}
            adminPassword={adminPassword}
            onPasswordChange={handlePasswordChange}
          />
        </div>

        {/* DESKTOP MAIN / MOBILE ACTIVE PREVIEW TAB */}
        <div 
          id="portfolio-stage"
          className={`flex-1 h-full overflow-y-auto overflow-x-hidden ${
            activeTabMobile === "preview" ? "block" : "hidden md:block"
          }`}
        >
          <PortfolioView
            data={portfolioData}
            isSplitView={isSplitView}
            onToggleView={handleToggleView}
          />
        </div>

      </div>

      {/* Absolute Admin Password Security Modal */}
      {isPasswordModalOpen && (
        <div id="password-modal-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            id="password-modal" 
            className="w-full max-w-sm bg-[#0b0b0c] border border-zinc-800 rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Settings className="w-20 h-20 text-zinc-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Sliders className="h-3.5 w-3.5" />
                <span className="font-mono text-[9px] tracking-widest uppercase">Identity Verification</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">Portfolio Customizer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Enter your security key code to establish an administrative sandbox link and initialize editing tools.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <input
                  type="password"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerifyPassword();
                  }}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition"
                  autoFocus
                />
                
                {passwordError ? (
                  <p className="text-[10px] text-red-500 font-mono flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    {passwordError}
                  </p>
                ) : (
                  <p className="text-[10px] text-zinc-500 font-mono italic">
                    {adminPassword === "admin" ? "Hint: password is 'admin'" : "Protected sandbox: Custom passcode has been configured"}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold tracking-tight font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={handleVerifyPassword}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold tracking-tight font-mono bg-white text-black hover:bg-white/90 transition cursor-pointer"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
