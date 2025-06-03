/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '34.69.214.55',
        port: '3001',
        pathname: '/**',
      },
    ],
    domains: [
      'localhost',
      'res.cloudinary.com',
      // otros dominios que necesites
    ]
  },
}
module.exports = nextConfig