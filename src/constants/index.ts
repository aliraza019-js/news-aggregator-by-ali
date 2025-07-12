/**
 * Application Constants
 * @author Ali Raza
 */

export const API_KEYS = {
  NEWS_API: '8af7a63d89574077a420361aa7fed8e0',
  GUARDIAN_API: '7af3990b-eb7c-443f-a468-508049f84464',
  NYTIMES_API: 'lpRJgOjU6LRaadr5RrlqIuLzPZ1XW03P',
} as const;

export const API_BASE_URLS = {
  NEWS_API: 'https://newsapi.org/v2',
  GUARDIAN_API: 'https://content.guardianapis.com',
  NYTIMES_API: 'https://api.nytimes.com/svc',
} as const;

export const CATEGORY_MAPPING = {
  technology: { newsapi: 'technology', guardian: 'technology', nytimes: 'technology' },
  business: { newsapi: 'business', guardian: 'business', nytimes: 'business' },
  science: { newsapi: 'science', guardian: 'science', nytimes: 'science' },
  health: { newsapi: 'health', guardian: 'health', nytimes: 'health' },
  sports: { newsapi: 'sports', guardian: 'sport', nytimes: 'sports' },
  entertainment: { newsapi: 'entertainment', guardian: 'culture', nytimes: 'arts' },
  politics: { newsapi: 'politics', guardian: 'politics', nytimes: 'politics' },
  world: { newsapi: 'general', guardian: 'world', nytimes: 'world' },
  general: { newsapi: 'general', guardian: 'news', nytimes: 'news' },
} as const;

export const CATEGORY_KEYWORDS = {
  sports: ['sport', 'football', 'basketball', 'tennis', 'soccer', 'baseball', 'nfl', 'nba', 'mlb', 'championship', 'tournament', 'game', 'match', 'player', 'team', 'coach', 'athlete', 'olympics', 'world cup'],
  technology: ['tech', 'technology', 'digital', 'software', 'app', 'ai', 'artificial intelligence', 'machine learning', 'startup', 'innovation', 'computer', 'internet', 'cyber', 'data', 'algorithm'],
  business: ['business', 'economy', 'financial', 'market', 'stock', 'investment', 'company', 'corporate', 'profit', 'revenue', 'ceo', 'entrepreneur', 'startup', 'venture', 'funding'],
  science: ['science', 'scientific', 'research', 'study', 'discovery', 'experiment', 'laboratory', 'scientist', 'physics', 'chemistry', 'biology', 'medicine', 'medical'],
  health: ['health', 'medical', 'medicine', 'doctor', 'hospital', 'patient', 'treatment', 'disease', 'vaccine', 'covid', 'pandemic', 'wellness', 'fitness'],
  entertainment: ['entertainment', 'movie', 'film', 'music', 'celebrity', 'actor', 'actress', 'hollywood', 'award', 'concert', 'performance', 'artist'],
  politics: ['politics', 'political', 'government', 'election', 'president', 'congress', 'senate', 'democrat', 'republican', 'policy', 'law', 'legislation'],
  world: ['world', 'international', 'global', 'foreign', 'country', 'nation', 'diplomacy', 'embassy', 'treaty', 'alliance'],
} as const;

export const SOURCE_MAP = {
  'BBC News': 'bbc-news',
  'CNN': 'cnn',
  'Reuters': 'reuters',
  'Associated Press': 'associated-press',
  'USA Today': 'usa-today',
  'NPR': 'npr',
  'Al Jazeera': 'al-jazeera-english',
  'The Washington Post': 'the-washington-post',
} as const;

export const CATEGORY_VARIATIONS = {
  technology: ['tech', 'technological', 'digital'],
  business: ['economy', 'financial', 'commerce'],
  science: ['scientific', 'research', 'study'],
  health: ['medical', 'healthcare', 'medicine'],
  sports: ['sport', 'athletic', 'game'],
  entertainment: ['entertainment', 'culture', 'arts'],
  politics: ['political', 'government', 'policy'],
  world: ['international', 'global', 'foreign'],
} as const;

export const DEFAULT_PREFERENCES = {
  preferredSources: ['The Guardian', 'The New York Times', 'BBC News'],
  preferredCategories: [],
  preferredAuthors: [],
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  SAVED_ARTICLES: 'savedArticles',
} as const;

export const DEFAULT_FILTERS = {
  keyword: '',
  category: '',
  source: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'publishedAt' as const,
} as const;

export const API_CONFIG = {
  PAGE_SIZE: 20,
  LANGUAGE: 'en',
} as const; 