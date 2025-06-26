"use client"
import { BlogList } from "@/components/blog-list";
import TitleBar from "@/components/titlebar";
import { useUserLocationInfo } from "@/components/userLocationInfo";
export default function BlogPage() {
  return (
    <main className="flex-1 pt-2">
      <TitleBar title="Blog"/>
      <section className="py-24 bg-background">
        <div className="max-w-none w-full py-2 px-0">
          <div className="text-center mb-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
              Blog
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Latest Blog Posts
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Insights, tutorials, and stories from my journey in tech and design.
            </p>
          </div>
          <BlogList />
        </div>
      </section>
    </main>
  );
}
