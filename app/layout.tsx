import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
// import { Inter } from "next/font/google"
import './globals.css'
import "plyr-react/plyr.css";
// const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL('https://filippodesvila.vercel.app'),
  title: "Filippo De Silva | Fullstack Developer Portfolio",
  description:
    "Explore my curated collection of professional web development projects showcasing full-stack expertise in building robust applications.",
  generator: 'Next.js',
  keywords: ['Fullstack Developer', 'Web Development','Filippo De Silva', 'Samuel Dagnachew', 'Web Developer',
    'Next.js', 'Nextjs', 'Next.js Fullstack Developer', 'Nextjs Fullstack Developer', 
    'Next.js Developer', 'Nextjs Developer', 'Java', 'Python', 'Python Developer', 
    'Java Developer', 'Node.js', 'Nodejs', 'Node.js Developer', 'Nodejs Developer', 
    'MERN Developer', 'AI Engineer', 'AI Developer', 'Flutter Developer', 'React Native Developer', 'Express Developer',],
  author: 'Filippo De Silva',

  //  Open Graph tags
   ogTitle: "Filippo De Silva - Fullstack Developer Portfolio",
   ogDescription:
     "Explore my curated collection of professional web development projects showcasing full-stack expertise in building robust applications.",
   ogUrl: 'https://www.filippodesilva.vercel.app',
   ogImage: '/path/to/og-image.jpg',
   ogType: 'website', // You can use other types like article, profile, etc., depending on the page's content.
  canonical: 'https://www.filippodesilva.vercel.app',

   // Twitter Card data
  twitterCard: 'summary_large_image',
  twitterTitle: "Filippo De Silva - Fullstack Developer Portfolio",
  twitterDescription:
    "Explore my curated collection of professional web development projects showcasing full-stack expertise in building robust applications.",
  twitterImage: '/path/to/twitter-image.jpg',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
      // className={inter.className}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
