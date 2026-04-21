/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/studyacorn', destination: 'https://studypebble.com', permanent: true },
      { source: '/studypebble', destination: 'https://studypebble.com', permanent: false },
      { source: '/essaycloner', destination: 'https://essaycloner.vercel.app', permanent: false },
      { source: '/shadowshield', destination: 'https://ai-shadow-shield.vercel.app', permanent: false },
      { source: '/trafficguard', destination: 'https://ai-traffic-guard.vercel.app', permanent: false },
      { source: '/flowdebug', destination: 'https://flowdebug.vercel.app', permanent: false },
      { source: '/whomealplanner', destination: 'https://who-meal-planner.vercel.app', permanent: false },
      { source: '/whowasright', destination: 'https://argument-analyzer-ten.vercel.app', permanent: false },
      { source: '/rulebotai', destination: 'https://rulebot-ai.vercel.app', permanent: false },
      { source: '/arrpower', destination: 'https://arrpower.vercel.app', permanent: false },
    ];
  },
};

export default nextConfig;
