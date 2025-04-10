"use client"

import { useState } from "react"
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
  tags: string[]
  link: string
  github: string
}

export function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="overflow-hidden group h-full flex flex-col border-border/50 transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-fill transition-transform duration-500 group-hover:scale-105"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-3"
        >
          <Button asChild variant="outline" size="sm">
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 size-4" />
              Code
            </Link>
          </Button>
          <Button asChild size="sm">
          {/* Will Enable this once i've deployed the projects */}
            {/* <Link href={project.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-4" />
              View
            </Link> */}            
          </Button>
        </motion.div>
      </div>
      <CardContent className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

