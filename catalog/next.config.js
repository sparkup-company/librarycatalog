/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'cover.ekz.de' },
      { hostname: 'covers.openlibrary.org' },
    ],
  },
}

module.exports = nextConfig
