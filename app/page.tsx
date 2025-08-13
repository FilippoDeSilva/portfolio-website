"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import { useUserLocationInfo } from "@/components/userLocationInfo";
import TitleBar from "@/components/titlebar";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.97]);
  const targetRef = useRef(null);

  const [githubProjects, setGithubProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/github-projects')
      .then(res => res.json())
      .then(data => setGithubProjects(data));
  }, []);

  const skills = [
    {
      name: "Frontend Development",
      icon: <Code className="size-6 text-primary" />,
      items: ["Next.js", "React", "Tailwind CSS", "HTML5/CSS3", "JavaScript/TypeScript"],
    },
    {
      name: "Backend Development",
      icon: <Server className="size-6 text-primary" />,
      items: ["Next.js", "React", "Node.js", "Python", "Java", "RESTful APIs"],
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
      items: ["Git", "Docker", "CI/CD", "Vercel"],
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
      <TitleBar title="Filippo De Silva" />
      
      <main className="flex-1 pt-16">
        <section id="home" className="relative min-h-[80vh] flex items-center overflow-hidden">
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
                    src="https://cdn.pixabay.com/photo/2024/04/09/03/04/ai-generated-8684869_1280.jpg"
                    alt="Profile"
                    fill
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
                    My design process starts with researching users' needs.
                    Then, I create logical information architecture and design
                    interfaces that are not only functional but also attractive,
                    delivering seamless digital experiences from front-end to
                    back-end.
                  </p>
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
                    Download Resume
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
                  <SkillCard skill={skill} />
                </motion.div>
              ))}
            </div>
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
                          description: repo.description || "",
                          image: repo.image || "/placeholder.svg",
                          githubOgImage: `https://opengraph.githubassets.com/1/${repo.owner?.login || "FilippoDeSilva"}/${repo.name}`,
                          tags: repo.topics || [],
                          link: repo.homepage || "#",
                          github: repo.html_url || "#",
                          stars: repo.stargazers_count,
                          forks: repo.forks_count,
                          watchers: repo.watchers_count,
                          isDeployed: repo.homepage && repo.homepage !== '' && repo.homepage !== '#',
                        }}
                      />
                    </motion.div>
                  );
                })
              ) : (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl border border-border bg-gradient-to-br from-background to-muted/40 shadow-lg flex flex-col h-[400px] p-6"
                    >
                      <div className="h-40 w-full bg-muted/60 rounded-xl mb-4" />
                      <div className="h-6 w-2/3 bg-muted/50 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-muted/40 rounded mb-4" />
                      <div className="flex-1" />
                      <div className="h-4 w-1/3 bg-muted/30 rounded mt-4" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

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
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
