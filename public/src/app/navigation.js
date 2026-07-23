import {
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  Wallet,
  Activity,
  Workflow,
  FlaskConical,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    section: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
      },
    ],
  },

  {
    section: "PLATFORM",
    items: [
      {
        title: "Create",
        icon: Sparkles,
        href: "/create",
      },

      {
        title: "Trust",
        icon: ShieldCheck,
        href: "/trust",
      },

      {
        title: "Operate",
        icon: Wallet,
        href: "/operate",
      },

      {
        title: "Monitor",
        icon: Activity,
        href: "/monitor",
      },

      {
        title: "Automate",
        icon: Workflow,
        href: "/automate",
      },

      {
        title: "Lab",
        icon: FlaskConical,
        href: "/lab",
      },
    ],
  },

  {
    section: "SYSTEM",
    items: [
      {
        title: "Settings",
        icon: Settings,
        href: "/settings",
      },
    ],
  },
];