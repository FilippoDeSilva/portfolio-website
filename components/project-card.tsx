"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Project {
  title: string
  description: string
  image: string
  githubOgImage?: string
  tags?: string[]
  link?: string
  github?: string
  stars?: number
  forks?: number
  watchers?: number
  isDeployed?: boolean
}

export function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgSrc, setImgSrc] = useState(project.image)
  const [hasError, setHasError] = useState(false)

  // Reset to original image when project changes
  useEffect(() => {
    setImgSrc(project.image)
    setHasError(false)
  }, [project.image])

  // Always reset to screenshot on hover, so user can retry loading screenshot
  useEffect(() => {
    if (isHovered && project.image && !hasError) {
      setImgSrc(project.image)
    }
  }, [isHovered, project.image, hasError])

  function handleImgError() {
    if (!hasError) {
      setHasError(true)
      // Try GitHub Open Graph image first
      if (imgSrc !== project.githubOgImage && project.githubOgImage) {
        setImgSrc(project.githubOgImage)
      } else if (imgSrc !== "/placeholder.svg") {
        setImgSrc("/placeholder.svg")
      }
    } else {
      // If GitHub Open Graph also fails, use placeholder
      setImgSrc("/placeholder.svg")
    }
  }

  // Validate URLs
  const isValidUrl = (url?: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasValidLiveLink = isValidUrl(project.link) && project.link !== '#';
  const hasValidGithubLink = isValidUrl(project.github);

  return (
    <Card
      className="overflow-hidden group h-full flex flex-col border-border/50 transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imgSrc}
          alt={project.title}
          fill
          className="object-fill transition-transform duration-500 group-hover:scale-105"
          onError={handleImgError}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-3"
        >
          {hasValidLiveLink && (
            <Button asChild size="sm">
              <Link href={project.link!} target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Live
              </Link>
            </Button>
          )}
          {hasValidGithubLink && (
            <Button asChild variant={hasValidLiveLink ? "outline" : "default"} size="sm">
              <Link href={project.github!} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 size-4" />
                Code
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
      <CardContent className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.tags || []).map((tag: string) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* GitHub stats */}
        {(project.stars !== undefined || project.forks !== undefined) && (
          <div className="flex gap-4 mt-auto text-xs text-muted-foreground">
            {project.stars !== undefined && (
              <span title="Stars">⭐ {project.stars}</span>
            )}
            {project.forks !== undefined && (
              <span title="Forks">🍴 {project.forks}</span>
            )}
            {project.watchers !== undefined && (
              <span title="Watchers">👁️ {project.watchers}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

