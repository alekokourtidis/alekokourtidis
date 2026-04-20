/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/studyacorn',
        destination: '/studypebble',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
