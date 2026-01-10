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

// Interface for Hebrew translations in frontmatter
interface HebrewTranslation {
  title?: string;
  summary?: string;
  industry?: string;
  duration?: string;
  results?: CaseStudyResult[];
  services?: string[];
  testimonial?: CaseStudyTestimonial;
  content?: string;
}

function getCaseStudyFiles(): string[] {
  try {
    if (!fs.existsSync(caseStudiesDirectory)) {
      return [];
    }
    return fs.readdirSync(caseStudiesDirectory).filter(file => file.endsWith('.md'));
  } catch {
    return [];
  }
}

export function getCaseStudySlugs(): string[] {
  return getCaseStudyFiles().map(file => file.replace(/\.md$/, ''));
}

export function getCaseStudyBySlug(slug: string, locale: string = 'en'): CaseStudy | null {
  try {
    const fullPath = path.join(caseStudiesDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Get Hebrew translations if locale is 'he' and translations exist
    const heTranslations: HebrewTranslation = data.he || {};
    const isHebrew = locale === 'he';

    return {
      slug,
      title: (isHebrew && heTranslations.title) || data.title || '',
      client: data.client || '',
      industry: (isHebrew && heTranslations.industry) || data.industry || '',
      platform: data.platform || '',
      duration: (isHebrew && heTranslations.duration) || data.duration || '',
      featured: data.featured || false,
      thumbnail: data.thumbnail || '',
      heroImage: data.heroImage || '',
      summary: (isHebrew && heTranslations.summary) || data.summary || '',
      results: (isHebrew && heTranslations.results) || data.results || [],
      services: (isHebrew && heTranslations.services) || data.services || [],
      testimonial: (isHebrew && heTranslations.testimonial) || data.testimonial,
      content: (isHebrew && heTranslations.content) || content,
    };
  } catch (error) {
    console.error(`Error reading case study ${slug}:`, error);
    return null;
  }
}

export function getAllCaseStudies(locale: string = 'en'): CaseStudyMeta[] {
  const slugs = getCaseStudySlugs();
  const caseStudies = slugs
    .map(slug => {
      const study = getCaseStudyBySlug(slug, locale);
      if (!study) return null;

      // Return metadata only (without full content)
      const { content: _, ...meta } = study;
      return meta;
    })
    .filter((study): study is CaseStudyMeta => study !== null);

  return caseStudies;
}

export function getFeaturedCaseStudies(locale: string = 'en'): CaseStudyMeta[] {
  return getAllCaseStudies(locale).filter(study => study.featured);
}

export function getCaseStudiesByIndustry(industry: string, locale: string = 'en'): CaseStudyMeta[] {
  return getAllCaseStudies(locale).filter(
    study => study.industry.toLowerCase() === industry.toLowerCase()
  );
}

export function getCaseStudiesByPlatform(platform: string, locale: string = 'en'): CaseStudyMeta[] {
  return getAllCaseStudies(locale).filter(study =>
    study.platform.toLowerCase().includes(platform.toLowerCase())
  );
}
