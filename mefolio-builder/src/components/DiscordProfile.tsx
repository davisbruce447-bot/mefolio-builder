import { useEffect, useState } from "react";
import { Disc, Music, Code, ShieldCheck, ExternalLink, HelpCircle } from "lucide-react";

interface DiscordUser {
  username: string;
  global_name: string;
  avatar: string;
  id: string;
}

interface SpotifyData {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id: string;
}

interface Activity {
  name: string;
  type: number; // 0: Playing, 1: Streaming, 2: Listening, 4: CustomStatus
  state?: string;
  details?: string;
  timestamps?: { start?: number; end?: number };
}

interface LanyardResponse {
  success: boolean;
  data: {
    discord_user: DiscordUser;
    discord_status: "online" | "idle" | "dnd" | "offline";
    listening_to_spotify: boolean;
    spotify: SpotifyData | null;
    activities: Activity[];
  };
}

interface DiscordProfileProps {
  discordId: string;
  simulateActive?: boolean; // toggle mock live activity
}

export default function DiscordProfile({ discordId, simulateActive = false }: DiscordProfileProps) {
  const [data, setData] = useState<LanyardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [spotifyProgress, setSpotifyProgress] = useState(38); // percent for mock track

  // Fetch real Lanyard data
  useEffect(() => {
    if (simulateActive) {
      setLoading(false);
      setError(false);
      return;
    }

    if (!discordId) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchPresence = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        if (!res.ok) throw new Error("User not found or Lanyard API error");
        
        const json: LanyardResponse = await res.json();
        if (json.success) {
          setData(json.data);
          setError(false);
        } else {
          throw new Error("Lanyard response unsuccessful");
        }
      } catch (err) {
        console.warn("Lanyard API error, using simulation as fallback:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPresence();
    
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchPresence, 10000);
    return () => clearInterval(interval);
  }, [discordId, simulateActive]);

  // Interval for simulated progress bars
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setSpotifyProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 1500);
    return () => clearInterval(progressInterval);
  }, []);

  // Set simulated mock data if explicitly requested or if Lanyard fetch failed
  const showMock = simulateActive || error || !discordId;

  const mockData: LanyardResponse["data"] = {
    discord_user: {
      username: "alex_devwood",
      global_name: "Alex Devwood",
      avatar: "mock_avatar",
      id: "914197960309993512",
    },
    discord_status: "online",
    listening_to_spotify: true,
    spotify: {
      song: "After Hours",
      artist: "The Weeknd",
      album: "After Hours",
      album_art_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&h=200&auto=format&fit=crop",
      track_id: "246810"
    },
    activities: [
      {
        name: "Visual Studio Code",
        type: 0,
        state: "Editing server.ts",
        details: "Workspace: mefolio-builder",
        timestamps: { start: Date.now() - 3600000 }
      },
      {
        name: "Studying Brain-Computer Interfaces",
        type: 4,
        state: "🔋 researching neural links"
      }
    ]
  };

  const activeData = showMock ? mockData : data;

  if (loading && !activeData) {
    return (
      <div id="discord-loading" className="flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl animate-pulse h-48">
        <Disc id="rotating-disc" className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
        <p className="text-xs text-slate-400 font-mono">Connecting to Lanyard API...</p>
      </div>
    );
  }

  if (!activeData) {
    return (
      <div id="discord-not-found" className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center">
        <HelpCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-200">No Discord ID Configured</p>
        <p className="text-xs text-slate-400 mt-1">Provide a Discord ID in customization settings to sync real-time activities.</p>
      </div>
    );
  }

  const { discord_user, discord_status, listening_to_spotify, spotify, activities } = activeData;

  // Status mapping
  const statusColors = {
    online: "bg-emerald-500 shadow-[0_0_10px_#10b981]",
    idle: "bg-amber-400 shadow-[0_0_10px_#fbbf24]",
    dnd: "bg-rose-500 shadow-[0_0_10px_#f43f5e]",
    offline: "bg-slate-400 shadow-[0_0_10px_#94a3b8]",
  };

  const statusLabels = {
    online: "Active",
    idle: "Away",
    dnd: "Do Not Disturb",
    offline: "Offline",
  };

  // Avatar resolution
  const avatarUrl = showMock
    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"
    : discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  // Find gaming or custom status activities
  const gameActivity = activities.find((act) => act.type === 0 && act.name !== "Spotify");
  const customStatus = activities.find((act) => act.type === 4);

  return (
    <div id="discord-card" className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/60 shadow-xl group">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/3 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/6 transition-colors duration-500" />
      
      {/* Top Banner indicating status live / mock */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative font-sans">
            <span className="flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                discord_status === "online" ? "bg-emerald-400" : discord_status === "offline" ? "bg-slate-400" : "bg-brand"
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                discord_status === "online" ? "bg-emerald-500" : discord_status === "offline" ? "bg-slate-500" : "bg-brand"
              }`} />
            </span>
            <span className="sr-only">{discord_status}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            {showMock ? "Presence Sandbox Mode" : "Live Discord Status"}
          </span>
        </div>
        {showMock && (
          <span className="text-[10px] bg-slate-800/60 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700/50">
            SIMULATOR
          </span>
        )}
      </div>

      {/* Profile Info block */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-shrink-0">
          <img
            src={avatarUrl}
            alt={discord_user.username}
            className="w-14 h-14 rounded-full object-cover border border-slate-700/80 p-0.5"
            referrerPolicy="no-referrer"
          />
          {/* Active status indicator on avatar */}
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center ${statusColors[discord_status]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h4 className="text-sm font-semibold text-slate-100 truncate">
              {discord_user.global_name || discord_user.username}
            </h4>
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 ml-1.5 flex-shrink-0" />
          </div>
          <p className="text-xs text-slate-400 font-mono truncate">@{discord_user.username}</p>
          {customStatus && (
            <p className="text-xs text-slate-400 mt-1 italic border-l-2 border-slate-800 pl-2">
              {customStatus.state}
            </p>
          )}
        </div>
      </div>

      {/* Spotify Active status or Gaming Activity split */}
      <div className="space-y-3.5">
        {/* Dynamic Spotify Listening Box */}
        {listening_to_spotify && spotify ? (
          <div id="spotify-card" className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5">
            <div className="flex items-center space-x-3">
              <div className="relative group/album">
                <img
                  src={spotify.album_art_url}
                  alt={spotify.album}
                  className="w-11 h-11 rounded-lg object-cover border border-emerald-500/20 group-hover/album:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/album:opacity-100 transition-opacity rounded-lg">
                  <Music className="h-4 w-4 text-emerald-400 animate-bounce" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono font-medium tracking-wide uppercase flex items-center">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping mr-1.5" />
                    Listening to Spotify
                  </span>
                  <a
                    href={`https://open.spotify.com/track/${spotify.track_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-emerald-400 transition"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <h5 className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                  {spotify.song}
                </h5>
                <p className="text-xs text-slate-400 truncate">
                  by {spotify.artist}
                </p>
              </div>
            </div>
            
            {/* Spotify Fake / Real Progress slider */}
            <div className="mt-3">
              <div className="h-1 bg-slate-850 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${spotifyProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1">
                <span>0:45</span>
                <span>{spotify.song === "After Hours" ? "6:01" : "3:14"}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Dynamic Game ID / VS Code Activity Box */}
        {gameActivity ? (
          <div id="coding-activity" className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3.5 flex items-start space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400 flex-shrink-0">
              <Code className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-indigo-400 font-mono font-medium tracking-wide uppercase">
                Playing / Coding
              </span>
              <h5 className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                {gameActivity.name}
              </h5>
              {gameActivity.details && (
                <p className="text-xs text-slate-400 truncate mt-0.5">{gameActivity.details}</p>
              )}
              {gameActivity.state && (
                <p className="text-xs text-slate-500 truncate mt-0.5 font-mono">{gameActivity.state}</p>
              )}
            </div>
          </div>
        ) : !listening_to_spotify ? (
          <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-4 text-center">
            <p className="text-xs font-mono text-slate-500">No active media stream or games currently broadcasting.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
