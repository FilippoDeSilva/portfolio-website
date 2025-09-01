"use client"
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BlogList } from "@/components/blog-list";
import TitleBar from "@/components/titlebar";
import { Pagination } from "@/components/ui/pagination";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid3X3, List } from "lucide-react";
const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const handleDataLoaded = (count: number) => {
    setTotalPosts(count);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Stable event handlers to prevent re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleSortChange = useCallback((newSort: "newest" | "oldest" | "popular") => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  const handleViewModeChange = useCallback((newMode: "grid" | "list") => {
    setViewMode(newMode);
  }, []);

  return (
    <>
    <main className="flex-1 pt-2">
      <TitleBar title="Blog"/>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Header Section - Centered on Large Screens */}
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

          {/* Search and Controls - Right Aligned on Large Screens */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4 mb-8">
            {/* Controls Container - Right Aligned on Large Screens */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full lg:w-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:justify-end">
                {/* Search Input - Full width on mobile, auto width on larger screens */}
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-9 h-9 text-sm w-full"
                  />
                </div>

                {/* Controls row - Stays together on all screen sizes */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as "newest" | "oldest" | "popular")}
                    className="h-9 px-3 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Popular</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex bg-muted rounded-md p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleViewModeChange("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleViewModeChange("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <BlogList 
            currentPage={currentPage} 
            onDataLoaded={handleDataLoaded}
            searchTerm={searchTerm}
            sortBy={sortBy}
            viewMode={viewMode}
            showControls={false}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </main>
      <div className="h-3">
    <Footer />
    </div>
    </>
  );
}
