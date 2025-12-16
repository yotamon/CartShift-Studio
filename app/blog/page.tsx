import { BlogTemplate } from "@/components/templates/BlogTemplate";
import { getAllPosts } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | CartShift Studio",
  description: "E-commerce tips, platform guides, case studies, and insights from CartShift Studio.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return <BlogTemplate posts={posts} categories={categories} />;
}

