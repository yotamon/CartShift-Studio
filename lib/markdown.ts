import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { unstable_cache } from "next/cache";
import { sanitizeHtml } from "@/lib/sanitize";
import { logError } from "@/lib/error-handler";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  content: string;
  readingTime?: number;
  translation?: {
    title: string;
    excerpt: string;
    category: string;
    content: string;
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Split content into English and Hebrew parts
    const contentParts = content.split("---he---");
    const contentEn = contentParts[0];
    const contentHe = contentParts[1] || ""; // Handle case where no Hebrew content exists

    // Process English content
    const processedContentEn = await remark().use(html).process(contentEn);
    const contentHtmlEn = sanitizeHtml(processedContentEn.toString());

    // Process Hebrew content if it exists
    let contentHtmlHe = "";
    if (contentHe) {
      const processedContentHe = await remark().use(html).process(contentHe);
      contentHtmlHe = sanitizeHtml(processedContentHe.toString());
    }

    const wordsPerMinute = 200;
    const wordCount = contentEn.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      category: data.category || "General",
      content: contentHtmlEn,
      readingTime,
      translation: {
        title: data.title_he || data.title || "",
        excerpt: data.excerpt_he || data.excerpt || "",
        category: data.category_he || data.category || "General",
        content: contentHtmlHe || contentHtmlEn, // Fallback to EN if HE missing
      },
    };
  } catch (error) {
    logError(`Error reading post ${slug}`, error);
    return null;
  }
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return getCachedAllPosts();
}



const getCachedAllPosts = unstable_cache(
  async () => {
    const slugs = getPostSlugs();
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const post = await getPostBySlug(slug);
        return post;
      })
    );

    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  },
  ["all-blog-posts"],
  { revalidate: 3600 }
);

export async function getCategories(): Promise<string[]> {
  const posts = await getCachedAllPosts();
  const categories = new Set<string>();

  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });

  return Array.from(categories);
}

