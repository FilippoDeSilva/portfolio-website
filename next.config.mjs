/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      // Top 50 commonly used image/video hosting providers
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" }, // Unsplash
      { protocol: "https", hostname: "cdn.pixabay.com", pathname: "/**" }, // Pixabay
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" }, // Pexels
      { protocol: "https", hostname: "media.gettyimages.com", pathname: "/**" }, // Getty Images
      { protocol: "https", hostname: "image.shutterstock.com", pathname: "/**" }, // Shutterstock
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" }, // YouTube Thumbnails
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" }, // YouTube CDN
      { protocol: "https", hostname: "www.youtube.com", pathname: "/**" }, // YouTube
      { protocol: "https", hostname: "vimeo.com", pathname: "/**" }, // Vimeo
      { protocol: "https", hostname: "player.vimeo.com", pathname: "/**" }, // Vimeo Player
      { protocol: "https", hostname: "www.dailymotion.com", pathname: "/**" }, // Dailymotion
      { protocol: "https", hostname: "scontent.cdninstagram.com", pathname: "/**" }, // Instagram CDN
      { protocol: "https", hostname: "instagram.fxyz1-1.fna.fbcdn.net", pathname: "/**" }, // Instagram
      { protocol: "https", hostname: "scontent.xx.fbcdn.net", pathname: "/**" }, // Facebook CDN
      { protocol: "https", hostname: "pbs.twimg.com", pathname: "/**" }, // Twitter/X
      { protocol: "https", hostname: "video.twimg.com", pathname: "/**" }, // Twitter/X Video
      { protocol: "https", hostname: "p16-sign-va.tiktokcdn.com", pathname: "/**" }, // TikTok
      { protocol: "https", hostname: "i.imgur.com", pathname: "/**" }, // Imgur CDN
      { protocol: "https", hostname: "live.staticflickr.com", pathname: "/**" }, // Flickr
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }, // Cloudinary
      { protocol: "https", hostname: "s3.amazonaws.com", pathname: "/**" }, // AWS S3
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" }, // GCP Storage
      { protocol: "https", hostname: "dl.dropboxusercontent.com", pathname: "/**" }, // Dropbox
      { protocol: "https", hostname: "i.pinimg.com", pathname: "/**" }, // Pinterest
      { protocol: "https", hostname: "media-exp1.licdn.com", pathname: "/**" }, // LinkedIn
      { protocol: "https", hostname: "preview.redd.it", pathname: "/**" }, // Reddit
      { protocol: "https", hostname: "media.discordapp.net", pathname: "/**" }, // Discord
      { protocol: "https", hostname: "64.media.tumblr.com", pathname: "/**" }, // Tumblr
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" }, // Wikimedia
      { protocol: "https", hostname: "media.tenor.com", pathname: "/**" }, // Tenor
      { protocol: "https", hostname: "media.giphy.com", pathname: "/**" }, // Giphy
      { protocol: "https", hostname: "cdn.streamable.com", pathname: "/**" }, // Streamable
      // { protocol: "https", hostname: "fast.wistia.com", pathname: "/**" }, // Wistia
      // { protocol: "https", hostname: "content.jwplatform.com", pathname: "/**" }, // JWPlayer
      { protocol: "https", hostname: "players.brightcove.net", pathname: "/**" }, // Brightcove
      { protocol: "https", hostname: "play.vidyard.com", pathname: "/**" }, // Vidyard
      { protocol: "https", hostname: "video.daily.co", pathname: "/**" }, // Daily.co
      { protocol: "https", hostname: "image.mux.com", pathname: "/**" }, // Mux
      { protocol: "https", hostname: "b-cdn.net", pathname: "/**" }, // BunnyCDN
      { protocol: "https", hostname: "global.ssl.fastly.net", pathname: "/**" }, // Fastly
      // { protocol: "https", hostname: "akamaized.net", pathname: "/**" }, // Akamai
      { protocol: "https", hostname: "assets.imgix.net", pathname: "/**" }, // Imgix
      { protocol: "https", hostname: "i.ibb.co", pathname: "/**" }, // ImgBB
      { protocol: "https", hostname: "img.freepik.com", pathname: "/**" }, // Freepik
      { protocol: "https", hostname: "static.canva.com", pathname: "/**" }, // Canva
      // { protocol: "https", hostname: "drscdn.500px.org", pathname: "/**" }, // 500px
      // { protocol: "https", hostname: "images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com", pathname: "/**" }, // DeviantArt
      { protocol: "https", hostname: "tdawmqlwnaxthhncuhee.supabase.co", pathname: "/storage/v1/object/public/blog-attachments/**" }, // Your Supabase storage
      { protocol: "https", hostname: "videos.openai.com", pathname: "/**" }, // OpenAI
      { protocol: "https", hostname: "media.istockphoto.com", pathname: "/**" }, // Istock
      { protocol: "https", hostname: "opengraph.githubassets.com", pathname: "/**" }, // GitHub Open Graph images
      { protocol: "https", hostname: "github.com", pathname: "/**" }, // GitHub repository pages
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" }, // Placeholder images for deployed projects
    ],
  },

  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;
