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
      }
    ],
   },
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.export = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};



export default nextConfig;
