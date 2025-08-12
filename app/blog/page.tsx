"use client"
import { useState } from "react";
import { BlogList } from "@/components/blog-list";
import TitleBar from "@/components/titlebar";
import { Pagination } from "@/components/ui/pagination";

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const handleDataLoaded = (count: number) => {
    setTotalPosts(count);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex-1 pt-2">
      <TitleBar title="Blog"/>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
              Blog
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Latest Blog Posts
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
            Thoughts, stories, and ideas from the things that spark my curiosity.
            </p>
          </div>
          <BlogList currentPage={currentPage} onDataLoaded={handleDataLoaded} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </main>
  );
}
