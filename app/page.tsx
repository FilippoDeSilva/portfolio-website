"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ArrowRight,
  Github,
  Linkedin,
  Menu,
  MousePointer,
  MoveUp,
  Send,
  Twitter,
  User,
  Code,
  Server,
  Database,
  MoveDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProjectCard } from "@/components/project-card";
import { SkillCard } from "@/components/skill-card";
import { ContactForm } from "@/components/contact-form";
import { BlogList } from "@/components/blog-list";
import { useUserLocationInfo } from "@/components/userLocationInfo";
import { useTheme } from "next-themes";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.97]);

  const targetRef = useRef(null);
  // const { scrollYProgress: scrollYProgressProjects } = useScroll({
  //   target: targetRef,
  //   offset: ["start end", "end start"],
  // });

  const [githubProjects, setGithubProjects] = useState<any[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    fetch('/api/github-projects')
      .then(res => res.json())
      .then(data => setGithubProjects(data));
  }, []);

  // const projects = [
  //   {
  //     title: "Fullstack School Management System",
  //     description:
  //       "A comprehensive school management system(SMS) Web App for universities and colleges that encompasses students, instructors and supervisors. The project has role based authentication with intuitive UI/UX designs.",
  //     image: "/classunity.jpg",
  //     tags: [
  //       "Next.js",
  //       "Tailwind CSS",
  //       "UI/UX Design",
  //       "Web App(PWA)",
  //       //  "Fullstack Development",
  //       "Docker",
  //       "Postgres",
  //       "Prisma",
  //       "Clerk",
  //       "Zod",
  //     ],
  //     link: "https://www.class-unity.vercel.com",
  //     github: "https://www.github.com/filippodesilva/class-unity-fullstack-sms",
  //   },
  //   {
  //     title: "AI Powered Job Scrapper",
  //     description:
  //       "A Next.js Project that accepts URL as an input and scrapes for jobs in the website and chat with the Hugging face inference model about the scrapped content.",
  //     image: "/scrapeai.jpg",
  //     tags: [
  //       "Nex.js",
  //       "Web App (PWA)",
  //       "Puppeteer",
  //       "Cheerio",
  //       "Axios",
  //       "PlayWright",
  //       "Hugging face Inference",
  //     ],
  //     link: "#",
  //     github: "https://www.github.com/filippodesilva/ai-job-scrapper",
  //   },
  //   {
  //     title: "Cursor/Windsurf AI telemetry bypass",
  //     description:
  //       "A python Command Line Tool (CLI) script that bypasses the telemetry data stored by cursor and windsurf to get free access.",
  //     image: "/cursor.jpg",
  //     tags: ["Python", "Python Script", "CLI tools"],
  //     link: "#",
  //     github: "https://www.github.com/filippodesilva/cursor-windsurf-ai-bypass",
  //   },
  //   {
  //     title: "Wi-Fi Brute Force",
  //     description:
  //       "A python based Wi-Fi security auditing CLI tool that has advanced features like multi-threading, network detection, starting where you left off, an option to choose between your wireless cards, word list support and testing a specific range of passwords.",
  //     image: "/wifiaudit.jpg",
  //     tags: [
  //       "Python",
  //       "Wireless Security",
  //       "Security Auditing Tools",
  //       "Python Script",
  //       "CLI tools",
  //     ],
  //     link: "#",
  //     github: "https://www.github.com/filippodesilva/Wi-Fi-Bruteforce",
  //   },
  //   {
  //     title: "Enterprise CRM System",
  //     description: "Customer relationship management interface redesign for improved workflow efficiency.",
  //     image: "/placeholder.svg?height=600&width=800",
  //     tags: ["Enterprise UX", "Workflow Design", "User Testing"],
  //     link: "#",
  //     github: "#",
  //   },
  //   {
  //     title: "Analytics Dashboard",
  //     description: "Data visualization platform with customizable views and real-time reporting capabilities.",
  //     image: "/placeholder.svg?height=600&width=800",
  //     tags: ["Dashboard Design", "Data Visualization", "UX Research"],
  //     link: "#",
  //     github: "#",
  //   },
  // ];

  const skills = [
    {
      name: "Frontend Development",
      icon: <Code className="size-6 text-primary" />,
      items: ["Next.js", "React", "Tailwind CSS", "HTML5/CSS3", "JavaScript/TypeScript"],
    },
    {
      name: "Backend Development",
      icon: <Server className="size-6 text-primary" />,
      items: ["Next.js", "React", "Node.js", 
        // "Express", 
        "Python", "Java", "RESTful APIs"],
    },
    {
      name: "Database Management",
      icon: <Database className="size-6 text-primary" />,
      items: ["PostgreSQL", "MongoDB", "Prisma", "SQL", "Data Modeling"],
    },
    {
      name: "UI/UX Design",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6 text-primary"
        >
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
          <path d="M12 2v2"></path>
          <path d="M12 22v-2"></path>
          <path d="m17 20.66-1-1.73"></path>
          <path d="M11 10.27 7 3.34"></path>
          <path d="m20.66 17-1.73-1"></path>
          <path d="m3.34 7 1.73 1"></path>
          <path d="M14 12h8"></path>
          <path d="M2 12h2"></path>
        </svg>
      ),
      items: ["Figma", "User Research", "Wire-framing", "Prototyping", "Responsive Design"],
    },
    {
      name: "DevOps & Tools",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6 text-primary"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      items: ["Git", "Docker", "CI/CD", 
        "Vercel", 
        // "AWS Basics"
      ],
    },
    {
      name: "Soft Skills",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6 text-primary"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      items: ["Problem Solving", "Communication", "Teamwork", "Time Management", "Adaptability", "Continuous Learning", "Dedication"],
    },
  ]

  const { name, resumeUrl, isLoading } = useUserLocationInfo();
  

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
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
        name
      )}
    </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            {['home', 'about', 'skills', 'projects', 'contact', 'blog'].map((item) => (
              <Link
                key={item}
                href={item === 'blog' ? '/blog' : `#${item}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === item ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setActiveSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme toggler using next-themes */}
            <button
              aria-label="Toggle Theme"
              className="rounded-full p-2 hover:bg-primary/10 transition-colors"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" style={{ color: '#3b82f6' }} />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-8">
                  {['home', 'about', 'skills', 'projects', 'contact', 'blog'].map((item) => (
                    <Link
                      key={item}
                      href={item === 'blog' ? '/blog' : `#${item}`}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => {
                        setActiveSection(item);
                        setSheetOpen(false); // Close menu on mobile after click
                      }}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section
          id="home"
          className="relative min-h-[80vh] flex items-center overflow-hidden"
        >
          {/* <SubtleParticles /> */}
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ opacity, scale }}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6"
              >
                <span className="relative flex size-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-3 bg-primary"></span>
                </span>
                Available for new opportunities
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6"
              >
                Fullstack Developer with focus on{" "}
                <span className="text-primary">user-centered</span> solutions
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-[600px] text-lg text-muted-foreground mb-8"
              >
                I design digital experiences that solve real problems for users
                while meeting business objectives. My approach combines
                research, strategy, and thoughtful design execution.
              </motion.p>

              <div className="flex gap-4 pt-5">
                  <Link
                    href="https://www.linkedin.com/in/filippo-de-silva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="size-6" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link
                    href="https://github.com/FilippoDeSilva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="size-6" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link
                    href="https://t.me/Lt_Col_Sam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Send className="size-6 transition-transform group-hover:translate-x-1" />
                    <span className="sr-only">Telegram</span>
                  </Link>
                  {/* <Link
                    href="https://twitter.com/filippodesilva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="size-6" />
                    <span className="sr-only">Twitter</span>
                  </Link> */}
                </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-sm text-muted-foreground mb-2">
              Scroll to explore
            </span>
            <MousePointer className="size-4 text-muted-foreground animate-bounce" />
          </motion.div>
        </section>

        <section id="about" className="py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
            >
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-4 rounded-xl bg-primary/5 blur-lg"></div>
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                <Image
  src="https://cdn.pixabay.com/photo/2023/10/20/14/25/ai-generated-8329596_1280.jpg"
  alt="Profile"
  fill
  // className="object-cover"
  priority
/>

                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
                  About Me
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Designing with purpose and precision
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    I'm a Junior Fullstack Developer, creating user-centered
                    digital products for clients. As a Junior Developer I've
                    done some hobby projects ranging from school management
                    systems to automation scripts and my Computer Science 
                    background shaped how I approach problems and find optimal
                    solutions. My approach combines strategic thinking with 
                    meticulous execution.
                  </p>
                  <p>
                    {/* My design process is rooted in understanding user needs through research, creating information
                    architecture that makes sense, and designing interfaces that are both functional and aesthetically
                    pleasing. */}
                    My design process starts with researching users' needs.
                    Then, I create logical information architecture and design
                    interfaces that are not only functional but also attractive,
                    delivering seamless digital experiences from front-end to
                    back-end.
                  </p>
                  {/* <p>
                    I've worked with cross-functional teams to deliver projects that not only meet business objectives
                    but also provide exceptional user experiences. My background in both design and frontend development
                    allows me to create solutions that are both beautiful and implementable.
                  </p> */}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="#contact">Get In Touch</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = resumeUrl;
                    }}
                  >
                    {" "}
                    Download Resume
                    {/* <Link href="/resume.pdf" target="_blank">
                        Download Resume
                     </Link> */}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="py-24 bg-muted/20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
                Professional Skills
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Expertise & Capabilities
              </h2>
              <p className="max-w-2xl mx-auto text-muted-foreground">
                My skill set spans from Frontend technologies to Backend
                technologies.
                {/* the entire UX process, from research and strategy to design execution and
                implementation. */}
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Remove SkillCard progress bar/skillsbar here */}
                  <SkillCard skill={skill} />
                </motion.div>
              ))}
            </div>

            {/* <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  viewport={{ once: true, margin: "-100px" }}
  className="mt-16 grid gap-8 md:grid-cols-3"
>
  <div className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:shadow-md">
    <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M2 12h10" />
        <path d="M9 4v16" />
        <path d="M14 9h8" />
        <path d="M18 5v8" />
      </svg>
    </div>
    <h3 className="text-xl font-bold mb-2">Fullstack Development</h3>
    <p className="text-muted-foreground">Designing and building scalable web apps using modern frameworks, APIs, and databases.</p>
  </div>

  <div className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:shadow-md">
    <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 19c-2.3 0-6.4-.2-8.1-.6-.7-.2-1.2-.7-1.4-1.4-.3-1.1-.5-3.4-.5-5s.2-3.9.5-5c.2-.7.7-1.2 1.4-1.4C5.6 5.2 9.7 5 12 5s6.4.2 8.1.6c.7.2 1.2.7 1.4 1.4.3 1.1.5 3.4.5 5s-.2 3.9-.5 5c-.2.7-.7 1.2-1.4 1.4-1.7.4-5.8.6-8.1.6z" />
        <polygon points="10 15 15 12 10 9" />
      </svg>
    </div>
    <h3 className="text-xl font-bold mb-2">Problem Solving</h3>
    <p className="text-muted-foreground">Tackling technical challenges with efficient, scalable solutions.</p>
  </div>

  <div className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:shadow-md">
    <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M8 18v-1" />
        <path d="M16 18v-3" />
      </svg>
    </div>
    <h3 className="text-xl font-bold mb-2">Continuous Learning</h3>
    <p className="text-muted-foreground">Staying current with emerging tools, best practices, and frameworks.</p>
  </div>
</motion.div> */}

          </div>
        </section>

        <section id="projects" className="py-24" ref={targetRef}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
                Portfolio
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Selected Projects
              </h2>
              <p className="max-w-2xl mx-auto text-muted-foreground">
                A collection of my most impactful works, showcasing my approach
                to solving complex problems.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {githubProjects.length > 0 ? (
                githubProjects.map((repo: any, index: number) => {
                  const { screenshot, githubOgImage } = getProjectImage(repo);
                  return (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <ProjectCard
                        project={{
                          title: repo.name,
                          description: repo.description,
                          image: screenshot || "",
                          githubOgImage,
                          tags: repo.topics || [],
                          link: repo.homepage && repo.homepage !== '' ? repo.homepage : repo.html_url,
                          github: repo.html_url,
                          stars: repo.stargazers_count,
                          forks: repo.forks_count,
                          watchers: repo.watchers_count,
                        }}
                      />
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16">
                  {/* Modern minimalistic spinner */}
                  <span className="relative flex h-12 w-12 mb-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent animate-spin"></span>
                  </span>
                  <p className="text-lg text-blue-600 font-semibold">Loading projects...</p>
                </div>
              )}
            </div>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mt-12 text-center"
            > */}
              {/* <Button size="lg" variant="outline" asChild>
                <Link href="https://dribbble.com" target="_blank" rel="noopener noreferrer">
                  View Complete Portfolio
                  <ExternalLink className="ml-2 size-4" />
                </Link>
              </Button> */}
            {/* </motion.div> */}
          </div>
        </section>

        {/* <section id="blog" className="py-24 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
                Blog
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Latest Blog Posts
              </h2>
              <p className="max-w-2xl mx-auto text-muted-foreground">
                Insights, tutorials, and stories from my journey in tech and design.
              </p>
            </motion.div>
            <BlogList />
          </div>
        </section> */}

        <section id="contact" className="py-24 bg-muted/20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2"
            >
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
                  Contact
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Let's Discuss Your Project
                </h2>
                <p className="text-muted-foreground mb-8">
                  I'm currently available for freelance work and full-time
                  opportunities. If you're looking for a fullstack developer who can
                  deliver thoughtful, user-centered fullstack software solutions, let's connect.
                </p>

                {/* <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Mail className="size-4 text-primary" />
                    </div>
                    <a
                      href="mailto:filippodesilva23@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Filippo De Silva
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Linkedin className="size-4 text-primary" />
                    </div>
                    <a
                      href="https://linkedin.com/in/yourname"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Filippo De Silva
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Twitter className="size-4 text-primary" />
                    </div>
                    <a
                      href="https://twitter.com/yourhandle"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                     Filippo De Silva
                    </a>
                  </div>
                </div> */}

                <div className="flex justify-center mb-2 animate-bounce text-blue-500"><MoveDown size={24} /></div>
                <div className="flex items-center gap-4 justify-center pt-5">
                  <Link
                    href="https://www.linkedin.com/in/filippo-de-silva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="size-7" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link
                    href="https://github.com/FilippoDeSilva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="size-7" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link
                    href="https://web.telegram.org/k/#@Lt_Col_Sam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Send className="size-7 transition-transform group-hover:translate-x-1" />
                    <span className="sr-only">Telegram</span>
                  </Link>
                  {/* <Link
                    href="https://twitter.com/filippodesilva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="size-7" />
                    <span className="sr-only">Twitter</span>
                  </Link> */}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-primary/5 blur-lg"></div>
                <div className="relative rounded-xl border border-border/50 bg-card p-6">
                  <ContactForm />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
          {/* <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="relative size-6 overflow-hidden rounded-full border border-primary/30">
              <span className="absolute inset-0 flex items-center justify-center text-primary">
                <MoveUp className="size-3" />
              </span>
            </div>
            <span className="font-medium">Filippo De Silva</span>
          </Link> */}

          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()}. All rights reserved.
            {/* {isLoading ? (
        <span className="inline-block h-5 w-fit bg-muted animate-ping rounded" />
      ) : (
        name
      )} */}
          </p>

          {/* <div className="flex gap-4">
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="size-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="size-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="size-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div> */}
        </div>
      </footer>
    </div>
  );
}

// Helper function to get the screenshot and Open Graph image for a project
function getProjectImage(repo: any) {
  // Always return screenshot (if homepage exists) and githubOgImage separately
  let githubOgImage = repo.image || "/placeholder.svg";
  let screenshot = null;
  if (
    repo.homepage &&
    repo.homepage.startsWith("http") &&
    !repo.homepage.includes("filippodesilva") &&
    !repo.homepage.includes("portfolio")
  ) {
    screenshot = `https://image.thum.io/get/width/800/crop/800/${encodeURIComponent(
      repo.homepage
    )}`;
  }
  // Always return both, let UI handle fallback
  return { screenshot, githubOgImage };
}
