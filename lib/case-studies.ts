import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const caseStudiesDirectory = path.join(process.cwd(), 'content/case-studies');

export interface CaseStudyResult {
  metric: string;
  before: string;
  after: string;
  improvement: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  client: string;
  industry: string;
  platform: string;
  duration: string;
  featured: boolean;
  thumbnail: string;
  heroImage: string;
  summary: string;
  results: CaseStudyResult[];
  services: string[];
  testimonial?: CaseStudyTestimonial;
}

export interface CaseStudy extends CaseStudyMeta {
  content: string;
}

function getCaseStudyFiles(): string[] {
  try {
    if (!fs.existsSync(caseStudiesDirectory)) {
      return [];
    }
    return fs.readdirSync(caseStudiesDirectory).filter((file) => file.endsWith('.md'));
  } catch {
    return [];
  }
}

export function getCaseStudySlugs(): string[] {
  return getCaseStudyFiles().map((file) => file.replace(/\.md$/, ''));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  try {
    const fullPath = path.join(caseStudiesDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      client: data.client || '',
      industry: data.industry || '',
      platform: data.platform || '',
      duration: data.duration || '',
      featured: data.featured || false,
      thumbnail: data.thumbnail || '',
      heroImage: data.heroImage || '',
      summary: data.summary || '',
      results: data.results || [],
      services: data.services || [],
      testimonial: data.testimonial,
      content,
    };
  } catch (error) {
    console.error(`Error reading case study ${slug}:`, error);
    return null;
  }
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  const slugs = getCaseStudySlugs();
  const caseStudies = slugs
    .map((slug) => {
      const study = getCaseStudyBySlug(slug);
      if (!study) return null;

      // Return metadata only (without full content)
      const { content: _, ...meta } = study;
      return meta;
    })
    .filter((study): study is CaseStudyMeta => study !== null);

  return caseStudies;
}

export function getFeaturedCaseStudies(): CaseStudyMeta[] {
  return getAllCaseStudies().filter((study) => study.featured);
}

export function getCaseStudiesByIndustry(industry: string): CaseStudyMeta[] {
  return getAllCaseStudies().filter(
    (study) => study.industry.toLowerCase() === industry.toLowerCase()
  );
}

export function getCaseStudiesByPlatform(platform: string): CaseStudyMeta[] {
  return getAllCaseStudies().filter((study) =>
    study.platform.toLowerCase().includes(platform.toLowerCase())
  );
}
