"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, User, X } from "lucide-react";
import { useUserLocationInfo } from "@/components/userLocationInfo";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/components/ui/use-mobile";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/#" },
  { id: "about", label: "About", href: "/#about" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "contact", label: "Contact", href: "/#contact" },
  { id: "blog", label: "Blog", href: "/blog" },
];

export default function TitleBar({ title, children }: { title: string; children?: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("home");
  const { theme, setTheme } = useTheme();
  const userInfo = useUserLocationInfo();
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set Blog as active for /blog, /blog/[id], and /blog/admin
    if (
      pathname === "/blog" ||
      (pathname && pathname.startsWith("/blog/")) ||
      pathname === "/blog/admin"
    ) {
      setActiveSection("blog");
      return;
    }

    if (pathname === "/") {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
              break;
            }
          }
        },
        { rootMargin: "-40% 0px -60% 0px" } // Active when section is in the middle 20% of viewport
      );

      const homeSections = NAV_ITEMS.filter(item => item.id !== 'blog');
      homeSections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });

      return () => {
        homeSections.forEach(({ id }) => {
          const element = document.getElementById(id);
          if (element) observer.unobserve(element);
        });
      };
    }
  }, [pathname]);

  const handleNavClick = (id: string) => {
    setActiveSection(id);

    if (id === "blog") {
      router.push("/blog");
      return;
    }

    if (id === 'home' && pathname !== '/') {
      router.push('/');
      return;
    }
    
    if (id === 'home' && pathname === '/'){
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        return;
    }

    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed justify-between top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md m-0 p-0">
      <div className="max-w-none w-full flex h-16 items-center justify-between px-4 md:px-20">
        <Link href="/" className="flex items-center gap-2 font-medium" onClick={() => setActiveSection('home')}>
          <div className="relative size-8 overflow-hidden rounded-full border border-primary/30">
            <span className="absolute inset-0 flex items-center justify-center text-primary">
              <User className="size-4" />
            </span>
          </div>
          <span className="text-lg font-medium tracking-tight">
            {userInfo?.name ? (
              <>{userInfo?.name || title}</>
            ) : (
              <span className="inline-block h-5 w-24 bg-muted animate-pulse rounded" />
            )}
          </span>
        </Link>
        <nav className="hidden md:flex gap-8">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
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
          
          {/* Hamburger Button */}
          <button
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="rounded-full p-2 hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            style={{ width: 40, height: 40 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          {children}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 top-16 z-40 bg-background/30 dark:bg-black/30 backdrop-blur-sm md:hidden"
              aria-hidden="true"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu */}
            <motion.nav
              key="mobile-menu"
              id="mobile-menu"
              initial={{ y: -32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -32, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 right-0 top-16 z-50 h-[calc(100vh-4rem)] bg-background/95 shadow-2xl flex flex-col items-center justify-center md:hidden rounded-b-2xl"
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            >
              <ul className="w-full flex flex-col items-center gap-4 px-4">
                {NAV_ITEMS.map(({ id, label, href }) => (
                  <li key={id} className="w-full">
                    <a
                      href={href}
                      onClick={e => {
                        e.stopPropagation();
                        handleNavClick(id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block w-full text-center py-3 px-4 rounded-lg text-lg font-semibold transition-colors ${
                        activeSection === id
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      tabIndex={0}
                      aria-current={activeSection === id ? "page" : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}