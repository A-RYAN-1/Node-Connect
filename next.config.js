/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the app is plain HTML/JS that talks to the chain from the
  // browser, so it needs no server and deploys to any static host.
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
