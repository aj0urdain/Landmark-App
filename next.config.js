/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this line to ignore hydration warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        hostname: "www.burgessrawson.com.au",
        protocol: "https",
      },
      {
        hostname: "dodfdwvvwmnnlntpnrec.supabase.co",
        protocol: "https",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        hostname: "static.ffx.io",
        protocol: "https",
      },
      {
        hostname: "i.imgur.com",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
