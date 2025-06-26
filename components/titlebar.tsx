"use client"
import Link from "next/link";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { User } from "lucide-react";
import { useUserLocationInfo } from "@/components/userLocationInfo";

export default function TitleBar({ title, children }: { title: string; children?: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>("home");
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const name = title;
  const userInfo = useUserLocationInfo();

  return (
    <header className="fixed justify-between top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md m-0 p-0">
      <div className="max-w-none w-full flex h-16 items-center justify-between px-4 md:px-20">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="relative size-8 overflow-hidden rounded-full border border-primary/30">
            <span className="absolute inset-0 flex items-center justify-center text-primary">
              <User className="size-4" />
            </span>
          </div>
          <span className="text-lg font-medium tracking-tight">
            {isLoading ? (
              <span className="inline-block h-5 w-fit bg-muted animate-ping rounded" />
            ) : (
              <>{userInfo?.name || name}</>
            )}
          </span>
        </Link>
        <nav className="hidden md:flex gap-8">
          {["home", "about", "skills", "projects", "contact", "blog"].map((item) => {
            let href = "/";
            if (item === "blog") href = "/blog";
            else if (item !== "home") href = `/#${item}`;
            // home = "/", blog = "/blog", others = "/#section"
            return (
              <Link
                key={item}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === item ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveSection(item)}
                scroll={item !== "blog" && item !== "home"}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle Theme"
            className="rounded-full p-2 hover:bg-primary/10 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" style={{ color: '#3b82f6' }} />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
          {children}
        </div>
      </div>
    </header>
  );
}