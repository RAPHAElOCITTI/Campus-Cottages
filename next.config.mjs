/** @type {import('next').NextConfig} */
 
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
      bodySizeLimit: '3mb',
      // Note: Setting serverActions to 'true' explicitly when other options are present
      // means that server actions are enabled and these options apply to them.
      // If 'true' was the *only* setting, it would just enable them with defaults.
      // When combining, you essentially enable them and then provide the specific configurations.
      // You don't need to explicitly add `true` if you're already providing options like allowedOrigins or bodySizeLimit,
      // as the presence of these options implies server actions are being configured and thus enabled.
    },
  },
};

module.exports = nextConfig;
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
      allowedOrigins: ['localhost:3000', 'campuscottages.vercel.app']
    }
  },



// eslint-disable-next-line @typescript-eslint/no-unused-vars

  eslint: {
    ignoreDuringBuilds: true,
  },
};



export default nextConfig;
