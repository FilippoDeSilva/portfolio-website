/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [{
      protocol:"https",
      hostname:'plus.unsplash.com',
    },
    { 
      protocol:"https",
      hostname:'cdn.pixabay.com'},
      {
      protocol: 'https',
      hostname: 'opengraph.githubassets.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: "https",
      hostname: "image.thum.io",
      port: '',
      pathname: '/get/**',
    },
    {
      protocol: "https",
      hostname: "media.istockphoto.com",
      port: '',
      pathname: '/**',
    },
    {
      protocol: "https",
      hostname: "tdawmqlwnaxthhncuhee.supabase.co",
      port: '',
      pathname: "/storage/v1/object/public/blog-attachments/**",
    },
    ],
  },

  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

}

export default nextConfig
