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

          {/* Search and Filter Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search posts by title or content..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-12 pr-4 h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-blue-600 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-base"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as "newest" | "oldest" | "popular")}
                      className="appearance-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-medium"
                    >
                      <option value="newest">✨ Newest First</option>
                      <option value="oldest">📅 Oldest First</option>
                      <option value="popular">🔥 Most Popular</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleViewModeChange("grid")}
                      className="h-8 px-3 rounded-md transition-all duration-200"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleViewModeChange("list")}
                      className="h-8 px-3 rounded-md transition-all duration-200"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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
