"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface SkillCardProps {
  skill: {
    name: string
    level: number
    icon: ReactNode
    items: string[]
  }
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Card className="overflow-hidden h-full border-border/50 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-primary/10 p-2">{skill.icon}</div>
          <div>
            <h3 className="text-xl font-bold">{skill.name}</h3>
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
          </div>
        </div>

        <ul className="space-y-2 mt-4">
          {skill.items.map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="rounded-full bg-primary/10 p-0.5 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm text-muted-foreground">{item}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
