"use client";

import React from "react";
import { PlayCircleIcon, SpeechIcon , ShieldCheckIcon} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      icon: PlayCircleIcon,
      label: "Interviews",
      path: "/dashboard",
      isActive: pathname.endsWith("/dashboard") || pathname.includes("/interviews"),
      description: "Manage your interviews"
    },
    {
      icon: SpeechIcon,
      label: "Interviewers", 
      path: "/dashboard/interviewers",
      isActive: pathname.endsWith("/interviewers"),
      description: "Configure AI interviewers"
    },
    {
      icon: ShieldCheckIcon,
      label: "ATS", 
      path: "/dashboard/ats",
      isActive: pathname.endsWith("/ats"),
      description: "ATS Integration"
    }
  ];

  return (
    <div className="z-[10] bg-white/95 backdrop-blur-xl border-r border-gray-100 p-6 w-[240px] fixed top-16 left-0 h-[calc(100vh-64px)] shadow-lg">
      <div className="flex flex-col h-full">

        {/* Menu Items */}
        <div className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.path}
                className={`group relative cursor-pointer transition-all duration-300 ${
                  item.isActive
                    ? "transform scale-[1.02]"
                    : "hover:transform hover:scale-[1.01]"
                }`}
                onClick={() => router.push(item.path)}
              >
                <div
                  className={`flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    item.isActive
                      ? "bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-lg shadow-primary-100/50 border border-primary-200/50"
                      : "text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-md"
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                    item.isActive 
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-200" 
                      : "bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <p className={`font-semibold text-sm ${
                      item.isActive 
                        ? "text-primary-700" 
                        : "text-gray-800 group-hover:text-gray-900"
                    }`}>
                      {item.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      item.isActive 
                        ? "text-primary-600" 
                        : "text-gray-500 group-hover:text-gray-600"
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  {item.isActive && (
                    <div className="w-1 h-8 bg-primary-500 rounded-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
            <span>3AM v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
