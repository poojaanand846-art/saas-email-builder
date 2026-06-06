"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, Building, CreditCard, AlertTriangle } from "lucide-react";

const navItems = [
  { name: "Profile", href: "/settings/profile", icon: User },
  { name: "Password", href: "/settings/password", icon: Lock },
  { name: "Workspace", href: "/settings/workspace", icon: Building },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
  { name: "Danger", href: "/settings/danger", icon: AlertTriangle },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-[1200px] w-full p-8 lg:p-12">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* Settings Sidebar / Top bar on mobile */}
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible w-full md:w-[240px] md:sticky top-12 pb-4 md:pb-0 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 min-h-[400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
