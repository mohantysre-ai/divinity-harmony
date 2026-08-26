import type { SacredText } from '@/data/sacred-texts';

export type SacredSourceContent = {
  source: string;
  sourceType: 'wikisource' | 'gutenberg' | 'wikipedia';
  host: string;
  language: string;
  title: string;
  url: string;
  license: string;
  content: string;
  activeChapter: string | null;
  chapters: string[];
};

const readJson = async (response: Response): Promise<SacredSourceContent> => {
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Source content is temporarily unavailable.');
  return payload;
};

export const fetchSacredSourceContent = async (
  text: SacredText,
  language: 'en' | 'sa' = 'en',
): Promise<SacredSourceContent> => {
  const params = new URLSearchParams({ title: text.title, category: text.category, language });
  return readJson(await fetch(`/api/sacred-texts/content?${params}`, { cache: 'no-store' }));
};

export const fetchSacredChapter = async (host: string, page: string): Promise<SacredSourceContent> => {
  const params = new URLSearchParams({ host, page });
  return readJson(await fetch(`/api/sacred-texts/chapter?${params}`, { cache: 'no-store' }));
};
