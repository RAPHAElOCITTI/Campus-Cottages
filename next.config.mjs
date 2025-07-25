/** @type {import('next').NextConfig} */

const nextConfig= {
  images: {
    remotePatterns: [
      {
        hostname: "a0.muscache.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "reikgvkfmbabfnguexdi.supabase.co",
        protocol: "https",
        port: "",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "encrypted-tbn0.gstatic.com",
        protocol: "https",
        port: "",
      }
    ],
   },
   
  // Configure for dynamic routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'campuscottages.vercel.app'],
      bodySizeLimit: '5mb',
    }
  },



// eslint-disable-next-line @typescript-eslint/no-unused-vars

  eslint: {
    ignoreDuringBuilds: true,
  },
};



export default nextConfig;
