// "use client";

// import { motion } from "framer-motion";
// import { BookOpen, TrendingUp, Clock, Users, Search, Filter, Grid3X3, List } from "lucide-react";
// import { BlogList } from "./blog-list";
// import { useState, useCallback } from "react";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// interface BlogLayoutProps {
//   title?: string;
//   description?: string;
//   showSearch?: boolean;
//   showStats?: boolean;
//   excludeId?: string;
//   columns?: number;
// }

// export function BlogLayout({
//   title = "Blog",
//   description = "Thoughts, stories, and ideas from the things that spark my curiosity.",
//   showSearch = true,
//   showStats = true,
//   excludeId,
//   columns = 3
// }: BlogLayoutProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
//   // Optimized handlers to prevent unnecessary re-renders
//   const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   }, []);

//   const handleSortChange = useCallback((newSort: "newest" | "oldest" | "popular") => {
//     setSortBy(newSort);
//   }, []);

//   const handleViewModeChange = useCallback((newMode: "grid" | "list") => {
//     setViewMode(newMode);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50 dark:from-gray-950/50 dark:via-gray-900 dark:to-gray-950/50">
//       {/* Hero Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10 py-16 sm:py-24"
//       >
//         <div className="absolute inset-0 bg-grid-pattern opacity-5" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-6"
//           >
//             <BookOpen className="w-10 h-10 text-primary" />
//           </motion.div>
          
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6"
//           >
//             {title}
//           </motion.h1>
          
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
//           >
//             {description}
//           </motion.p>

//           {/* Quick Stats */}
//           {showStats && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="flex flex-wrap justify-center gap-8 mt-12"
//             >
//               {[
//                 { icon: TrendingUp, label: "Trending", value: "24 posts" },
//                 { icon: Clock, label: "Updated", value: "2 hours ago" },
//                 { icon: Users, label: "Readers", value: "1.2k+" }
//               ].map((stat, index) => (
//                 <motion.div
//                   key={stat.label}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.6 + index * 0.1 }}
//                   className="text-center"
//                 >
//                   <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center">
//                     <stat.icon className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     {stat.label}
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </div>
//       </motion.div>

//       {/* Modern Search and Filter Section */}
//       {showSearch && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10"
//         >
//           <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-gray-200/40 dark:border-gray-700/40 rounded-3xl shadow-2xl p-8">
//             <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
//               {/* Enhanced Search Input */}
//               <div className="relative flex-1 max-w-2xl">
//                 <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
//                 <Input
//                   type="text"
//                   placeholder="Search posts by title or content..."
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   className="pl-14 pr-6 h-16 rounded-2xl border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-lg font-medium shadow-lg transition-all duration-300"
//                 />
//               </div>

//               {/* Enhanced Filter Controls */}
//               <div className="flex items-center gap-6">
//                 {/* Sort Dropdown */}
//                 <div className="relative">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => handleSortChange(e.target.value as "newest" | "oldest" | "popular")}
//                     className="appearance-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl px-6 py-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 font-semibold shadow-lg min-w-[160px]"
//                   >
//                     <option value="newest">✨ Newest First</option>
//                     <option value="oldest">📅 Oldest First</option>
//                     <option value="popular">🔥 Most Popular</option>
//                   </select>
//                   <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//                 </div>

//                 {/* Enhanced View Mode Toggle */}
//                 <div className="flex bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
//                   <Button
//                     variant={viewMode === "grid" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => handleViewModeChange("grid")}
//                     className="h-12 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
//                   >
//                     <Grid3X3 className="w-5 h-5" />
//                     Grid
//                   </Button>
//                   <Button
//                     variant={viewMode === "list" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => handleViewModeChange("list")}
//                     className="h-12 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
//                   >
//                     <List className="w-5 h-5" />
//                     List
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Blog Content */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.7 }}
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
//       >
//         <BlogList
//           excludeId={excludeId}
//           columns={columns}
//           searchTerm={searchTerm}
//           sortBy={sortBy}
//           viewMode={viewMode}
//           showControls={false}
//           onDataLoaded={(totalPosts) => {
//             // You can use this to show total post count or implement pagination
//             console.log(`Total posts: ${totalPosts}`);
//           }}
//         />
//       </motion.div>

//       {/* Bottom CTA */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.8 }}
//         className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10 py-16"
//       >
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
//             Stay Updated
//           </h2>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
//             Get notified when new posts are published and join our growing community of readers.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button size="lg" className="px-8 py-3 text-lg font-medium">
//               Subscribe to Newsletter
//             </Button>
//             <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-medium">
//               Follow on Social
//             </Button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// // CSS for grid pattern background
// const gridPattern = `
//   <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
//     <g fill="none" fill-rule="evenodd">
//       <g fill="currentColor" fill-opacity="0.1">
//         <circle cx="30" cy="30" r="1"/>
//       </g>
//     </g>
//   </svg>
// `;

// // Add the grid pattern to the document
// if (typeof document !== 'undefined') {
//   const style = document.createElement('style');
//   style.textContent = `
//     .bg-grid-pattern {
//       background-image: url("data:image/svg+xml,${encodeURIComponent(gridPattern)}");
//       background-size: 60px 60px;
//     }
//   `;
//   document.head.appendChild(style);
// }
