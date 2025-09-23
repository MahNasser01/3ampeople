import Link from "next/link";
import React from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[10] h-16 shadow-sm">
      <div className="flex items-center justify-between h-full px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href={"/dashboard"} className="flex items-center gap-3 group">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl group-hover:bg-primary-50/50 transition-all duration-300 group-hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3A</span>
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold text-gray-900 leading-none">
                  3AM<span className="text-primary-500">People</span>
                </p>
              </div>
            </div>
          </Link>
          
          <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          
          <div className="hidden md:block">
            <OrganizationSwitcher
              afterCreateOrganizationUrl="/dashboard"
              hidePersonal={true}
              afterSelectOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              appearance={{
                variables: {
                  fontSize: "0.875rem",
                  colorPrimary: "rgb(255, 94, 31)",
                  borderRadius: "0.75rem",
                },
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UserButton 
              afterSignOutUrl="/sign-in" 
              signInUrl="/sign-in"
              appearance={{
                variables: {
                  colorPrimary: "rgb(255, 94, 31)",
                  borderRadius: "0.75rem",
                },
              }}
            />
          </div>
          
          <div className="md:hidden">
            <UserButton 
              afterSignOutUrl="/sign-in" 
              signInUrl="/sign-in"
              appearance={{
                variables: {
                  colorPrimary: "rgb(255, 94, 31)",
                  borderRadius: "0.75rem",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
