export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  iconName: string; // e.g. "Github", "Globe", "Cpu", "Code", "Server", "Database", "Terminal", "Smartphone"
}

export interface TechCategory {
  name: string;
  skills: { name: string; level?: number }[];
}

export interface PortfolioData {
  name: string;
  avatarUrl: string;
  title: string; // main title under name
  bio: string;
  location: string;
  discordId: string; // Lanyard API target
  taglines: string[];
  socials: SocialLinks;
  projects: Project[];
  techCategories: TechCategory[];
  themeColor: 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber' | 'cyan';
  constellationDensity: number; // star count (e.g. 100)
}

export const DEFAULT_PORTFOLIO: PortfolioData = {
  name: "Alex Devwood",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
  title: "Full-Stack Software Engineer & Creative Developer",
  bio: "Hi! I'm Alex, a software designer and system engineer. I craft gorgeous, fluid web applications and scale performant backend architectures. Actively studying neural interfaces and distributed networks.",
  location: "San Francisco, CA",
  discordId: "914197960309993512", // Default discord ID for fallback / preview
  taglines: [
    "I build responsive web clients",
    "I engineer distributed APIs",
    "I design interactive visual systems",
    "I tinker with generative AI"
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "alex@devwood.io",
    website: "https://devwood.io"
  },
  projects: [
    {
      id: "1",
      title: "Constellation AI Engine",
      description: "A fast canvas particle synthesizer and neural connection graph that renders dynamic generative designs synced with audio frequencies.",
      tags: ["React", "HTML5 Canvas", "Gemini API", "Web Audio"],
      githubUrl: "https://github.com",
      demoUrl: "https://devwood.io",
      iconName: "Cpu"
    },
    {
      id: "2",
      title: "Lanyard Dynamic Presence",
      description: "A secure, lightning-fast dashboard fetching real-time user activities, games played, and Spotify tracks directly into static profiles.",
      tags: ["TypeScript", "Lanyard API", "WebSocket", "Vite"],
      githubUrl: "https://github.com",
      demoUrl: "https://devwood.io",
      iconName: "Terminal"
    },
    {
      id: "3",
      title: "Prism Database Sync",
      description: "A ultra-low latency key-value pipeline that aggregates multi-tenant transaction caches into SQLite databases on edge networks.",
      tags: ["Go", "SQLite", "gRPC", "Docker"],
      githubUrl: "https://github.com",
      demoUrl: "https://devwood.io",
      iconName: "Database"
    },
    {
      id: "4",
      title: "Aurora Mobile Suite",
      description: "A minimalist mobile navigation package with customized physical haptics, spring animations, and native rendering speeds.",
      tags: ["React Native", "Expo", "Reanimated", "Skia"],
      githubUrl: "https://github.com",
      demoUrl: "https://devwood.io",
      iconName: "Smartphone"
    }
  ],
  techCategories: [
    {
      name: "Frontend Stack",
      skills: [
        { name: "React 19" },
        { name: "TypeScript" },
        { name: "Tailwind CSS v4" },
        { name: "Motion" },
        { name: "Next.js" }
      ]
    },
    {
      name: "Backend & Systems",
      skills: [
        { name: "Node.js" },
        { name: "Go (Golang)" },
        { name: "PostgreSQL" },
        { name: "Express" },
        { name: "GraphQL" }
      ]
    },
    {
      name: "Infrastructure & Tools",
      skills: [
        { name: "Docker" },
        { name: "GitHub Actions" },
        { name: "Google Cloud Platform" },
        { name: "Vite" },
        { name: "Git" }
      ]
    }
  ],
  themeColor: "indigo",
  constellationDensity: 80
};
