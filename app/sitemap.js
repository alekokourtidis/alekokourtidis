import { getAllPosts } from "../lib/blog-posts";

const SITE = "https://alekotools.com";

export default function sitemap() {
  const posts = getAllPosts();

  const blogEntries = posts.map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: SITE, lastModified: new Date().toISOString(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/blog`, lastModified: new Date().toISOString(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
    ...blogEntries,
  ];
}
