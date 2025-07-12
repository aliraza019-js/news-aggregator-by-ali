import axios from 'axios';
import { Article, NewsAPIResponse, GuardianAPIResponse, NYTimesAPIResponse } from '../types';

// API Keys from environment variables
const NEWS_API_KEY = '8af7a63d89574077a420361aa7fed8e0';
const GUARDIAN_API_KEY = '7af3990b-eb7c-443f-a468-508049f84464';
const NYTIMES_API_KEY = 'lpRJgOjU6LRaadr5RrlqIuLzPZ1XW03P';

// Base URLs
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const GUARDIAN_API_BASE_URL = 'https://content.guardianapis.com';
const NYTIMES_API_BASE_URL = 'https://api.nytimes.com/svc';

// Category mapping for different APIs
const mapCategoryForAPI = (category: string, apiType: 'newsapi' | 'guardian' | 'nytimes'): string => {
  const categoryMap: { [key: string]: { newsapi: string; guardian: string; nytimes: string } } = {
    'technology': { newsapi: 'technology', guardian: 'technology', nytimes: 'technology' },
    'business': { newsapi: 'business', guardian: 'business', nytimes: 'business' },
    'science': { newsapi: 'science', guardian: 'science', nytimes: 'science' },
    'health': { newsapi: 'health', guardian: 'health', nytimes: 'health' },
    'sports': { newsapi: 'sports', guardian: 'sport', nytimes: 'sports' },
    'entertainment': { newsapi: 'entertainment', guardian: 'culture', nytimes: 'arts' },
    'politics': { newsapi: 'politics', guardian: 'politics', nytimes: 'politics' },
    'world': { newsapi: 'general', guardian: 'world', nytimes: 'world' },
    'general': { newsapi: 'general', guardian: 'news', nytimes: 'news' },
  };

  const mapped = categoryMap[category.toLowerCase()];
  if (mapped) {
    return mapped[apiType];
  }
  
  // Default mapping
  return category;
};

// Function to detect category from article content
const detectCategoryFromContent = (title: string, description: string, content: string): string => {
  const text = `${title} ${description} ${content}`.toLowerCase();
  
  const categoryKeywords: { [key: string]: string[] } = {
    'sports': ['sport', 'football', 'basketball', 'tennis', 'soccer', 'baseball', 'nfl', 'nba', 'mlb', 'championship', 'tournament', 'game', 'match', 'player', 'team', 'coach', 'athlete', 'olympics', 'world cup'],
    'technology': ['tech', 'technology', 'digital', 'software', 'app', 'ai', 'artificial intelligence', 'machine learning', 'startup', 'innovation', 'computer', 'internet', 'cyber', 'data', 'algorithm'],
    'business': ['business', 'economy', 'financial', 'market', 'stock', 'investment', 'company', 'corporate', 'profit', 'revenue', 'ceo', 'entrepreneur', 'startup', 'venture', 'funding'],
    'science': ['science', 'scientific', 'research', 'study', 'discovery', 'experiment', 'laboratory', 'scientist', 'physics', 'chemistry', 'biology', 'medicine', 'medical'],
    'health': ['health', 'medical', 'medicine', 'doctor', 'hospital', 'patient', 'treatment', 'disease', 'vaccine', 'covid', 'pandemic', 'wellness', 'fitness'],
    'entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'actor', 'actress', 'hollywood', 'award', 'concert', 'performance', 'artist'],
    'politics': ['politics', 'political', 'government', 'election', 'president', 'congress', 'senate', 'democrat', 'republican', 'policy', 'law', 'legislation'],
    'world': ['world', 'international', 'global', 'foreign', 'country', 'nation', 'diplomacy', 'embassy', 'treaty', 'alliance'],
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      console.log(`Category detected as "${category}" for article: "${title.substring(0, 50)}..."`);
      return category;
    }
  }
  
  console.log(`Category detected as "general" for article: "${title.substring(0, 50)}..."`);
  return 'general';
};

// NewsAPI Service
export const newsAPIService = {
  async searchArticles(params: {
    q?: string;
    category?: string;
    sources?: string;
    from?: string;
    to?: string;
    sortBy?: string;
    page?: number;
  }): Promise<Article[]> {
    try {
      const response = await axios.get<NewsAPIResponse>(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          ...params,
          apiKey: NEWS_API_KEY,
          language: 'en',
          pageSize: 20,
        },
      });

      return response.data.articles.map((article, index) => ({
        id: `newsapi-${index}`,
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        url: article.url,
        urlToImage: article.urlToImage || '',
        publishedAt: article.publishedAt,
        source: {
          id: article.source.id || article.source.name,
          name: article.source.name,
        },
        author: article.author,
        category: detectCategoryFromContent(article.title, article.description || '', article.content || ''),
      }));
    } catch (error) {
      console.error('NewsAPI Error:', error);
      return [];
    }
  },

  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    page?: number;
  }): Promise<Article[]> {
    try {
      const response = await axios.get<NewsAPIResponse>(`${NEWS_API_BASE_URL}/top-headlines`, {
        params: {
          ...params,
          apiKey: NEWS_API_KEY,
          pageSize: 20,
        },
      });

      return response.data.articles.map((article, index) => ({
        id: `newsapi-headlines-${index}`,
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        url: article.url,
        urlToImage: article.urlToImage || '',
        publishedAt: article.publishedAt,
        source: {
          id: article.source.id || article.source.name,
          name: article.source.name,
        },
        author: article.author,
        category: detectCategoryFromContent(article.title, article.description || '', article.content || ''),
      }));
    } catch (error) {
      console.error('NewsAPI Headlines Error:', error);
      return [];
    }
  },

  // Map of source names to their NewsAPI source IDs
  getSourceId(sourceName: string): string | null {
    const sourceMap: { [key: string]: string } = {
      'BBC News': 'bbc-news',
      'CNN': 'cnn',
      'Reuters': 'reuters',
      'Associated Press': 'associated-press',
      'USA Today': 'usa-today',
      'NPR': 'npr',
      'Al Jazeera': 'al-jazeera-english',
      'The Washington Post': 'the-washington-post',
    };
    return sourceMap[sourceName] || null;
  },
};

// Guardian API Service
export const guardianAPIService = {
  async searchArticles(params: {
    q?: string;
    section?: string;
    'from-date'?: string;
    'to-date'?: string;
    'order-by'?: string;
    page?: number;
  }): Promise<Article[]> {
    try {
      const response = await axios.get<GuardianAPIResponse>(`${GUARDIAN_API_BASE_URL}/search`, {
        params: {
          ...params,
          'api-key': GUARDIAN_API_KEY,
          'show-fields': 'thumbnail,bodyText',
          'page-size': 20,
        },
      });

      return response.data.response.results.map((article) => ({
        id: article.id,
        title: article.webTitle,
        description: article.fields?.bodyText?.substring(0, 200) || '',
        content: article.fields?.bodyText || '',
        url: article.webUrl,
        urlToImage: article.fields?.thumbnail || '',
        publishedAt: article.webPublicationDate,
        source: {
          id: 'guardian',
          name: 'The Guardian',
        },
        author: '',
        category: detectCategoryFromContent(article.webTitle, article.fields?.bodyText?.substring(0, 200) || '', article.fields?.bodyText || ''),
      }));
    } catch (error) {
      console.error('Guardian API Error:', error);
      return [];
    }
  },
};

// NY Times API Service
export const nyTimesAPIService = {
  async searchArticles(params: {
    q?: string;
    fq?: string;
    begin_date?: string;
    end_date?: string;
    sort?: string;
    page?: number;
  }): Promise<Article[]> {
    try {
      const response = await axios.get<NYTimesAPIResponse>(`${NYTIMES_API_BASE_URL}/search/v2/articlesearch.json`, {
        params: {
          ...params,
          'api-key': NYTIMES_API_KEY,
        },
      });

      return response.data.response.docs.map((article) => ({
        id: article._id,
        title: article.headline.main,
        description: article.abstract,
        content: article.lead_paragraph,
        url: article.web_url,
        urlToImage: article.multimedia.find(m => m.subtype === 'thumbnail')?.url 
          ? `https://www.nytimes.com/${article.multimedia.find(m => m.subtype === 'thumbnail')?.url}`
          : '',
        publishedAt: article.pub_date,
        source: {
          id: 'nytimes',
          name: 'The New York Times',
        },
        author: article.byline.original,
        category: detectCategoryFromContent(article.headline.main, article.abstract, article.lead_paragraph),
      }));
    } catch (error) {
      console.error('NY Times API Error:', error);
      return [];
    }
  },
};

// Combined service that fetches from all sources
export const combinedNewsService = {
  async searchAllSources(params: {
    keyword?: string;
    category?: string;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
  }): Promise<Article[]> {
    const allArticles: Article[] = [];

    console.log('Search parameters:', params);

    try {
      // Determine which sources to fetch from based on the source filter
      const shouldFetchNewsAPI = !params.source || 
        ['BBC News', 'CNN', 'Reuters', 'Associated Press', 'USA Today', 'NPR', 'Al Jazeera', 'The Washington Post'].includes(params.source);
      
      const shouldFetchGuardian = !params.source || params.source === 'The Guardian';
      const shouldFetchNYTimes = !params.source || params.source === 'The New York Times';

      console.log('Should fetch from:', { shouldFetchNewsAPI, shouldFetchGuardian, shouldFetchNYTimes });

      // Fetch from NewsAPI if no specific source is selected or if the source is from NewsAPI
      if (shouldFetchNewsAPI) {
        const mappedCategory = params.category ? mapCategoryForAPI(params.category, 'newsapi') : undefined;
        
        console.log('Fetching from NewsAPI with params:', {
          q: params.keyword,
          category: mappedCategory,
          from: params.dateFrom,
          to: params.dateTo,
          sortBy: params.sortBy,
        });

        const newsAPIArticles = await newsAPIService.searchArticles({
          q: params.keyword,
          category: mappedCategory,
          from: params.dateFrom,
          to: params.dateTo,
          sortBy: params.sortBy,
        });
        
        console.log('NewsAPI articles found:', newsAPIArticles.length);
        
        // If a specific source is selected, filter the NewsAPI results
        if (params.source && params.source !== 'NewsAPI') {
          // Try to get the NewsAPI source ID for better filtering
          const sourceId = newsAPIService.getSourceId(params.source);
          let filteredNewsAPIArticles;
          
          if (sourceId) {
            // If we have a source ID, try to fetch articles specifically from that source
            try {
              const sourceSpecificArticles = await newsAPIService.getTopHeadlines({
                sources: sourceId,
                category: mappedCategory,
              });
              filteredNewsAPIArticles = sourceSpecificArticles;
            } catch (error) {
              // Fallback to filtering from all articles
              filteredNewsAPIArticles = newsAPIArticles.filter(article => 
                article.source.name === params.source
              );
            }
          } else {
            // Fallback to filtering from all articles
            filteredNewsAPIArticles = newsAPIArticles.filter(article => 
              article.source.name === params.source
            );
          }
          
          console.log('Filtered NewsAPI articles for source', params.source, ':', filteredNewsAPIArticles.length);
          allArticles.push(...filteredNewsAPIArticles);
        } else {
          allArticles.push(...newsAPIArticles);
        }
      }

      // Fetch from Guardian if no specific source is selected or if Guardian is selected
      if (shouldFetchGuardian) {
        const mappedCategory = params.category ? mapCategoryForAPI(params.category, 'guardian') : undefined;
        
        console.log('Fetching from Guardian with params:', {
          q: params.keyword,
          section: mappedCategory,
          'from-date': params.dateFrom,
          'to-date': params.dateTo,
          'order-by': params.sortBy === 'publishedAt' ? 'newest' : 'relevance',
        });

        const guardianArticles = await guardianAPIService.searchArticles({
          q: params.keyword,
          section: mappedCategory,
          'from-date': params.dateFrom,
          'to-date': params.dateTo,
          'order-by': params.sortBy === 'publishedAt' ? 'newest' : 'relevance',
        });
        console.log('Guardian articles found:', guardianArticles.length);
        allArticles.push(...guardianArticles);
      }

      // Fetch from NY Times if no specific source is selected or if NY Times is selected
      if (shouldFetchNYTimes) {
        const mappedCategory = params.category ? mapCategoryForAPI(params.category, 'nytimes') : undefined;
        
        console.log('Fetching from NY Times with params:', {
          q: params.keyword,
          fq: mappedCategory ? `news_desk:(${mappedCategory})` : undefined,
          begin_date: params.dateFrom?.replace(/-/g, ''),
          end_date: params.dateTo?.replace(/-/g, ''),
          sort: params.sortBy === 'publishedAt' ? 'newest' : 'relevance',
        });

        const nyTimesArticles = await nyTimesAPIService.searchArticles({
          q: params.keyword,
          fq: mappedCategory ? `news_desk:(${mappedCategory})` : undefined,
          begin_date: params.dateFrom?.replace(/-/g, ''),
          end_date: params.dateTo?.replace(/-/g, ''),
          sort: params.sortBy === 'publishedAt' ? 'newest' : 'relevance',
        });
        console.log('NY Times articles found:', nyTimesArticles.length);
        allArticles.push(...nyTimesArticles);
      }

      // Apply additional filtering for category if specified
      let filteredArticles = allArticles;
      if (params.category && params.category !== '') {
        console.log('Filtering by category:', params.category);
        filteredArticles = allArticles.filter(article => {
          if (!article.category) return false;
          
          const searchCategory = params.category?.toLowerCase();
          if (!searchCategory) return false;
          
          // Check for exact match first
          if (article.category.toLowerCase() === searchCategory) {
            return true;
          }
          
          // Check for partial matches
          const articleCategory = article.category.toLowerCase();
          
          return articleCategory.includes(searchCategory) || searchCategory.includes(articleCategory);
        });
        console.log('Articles after category filtering:', filteredArticles.length);
      }

      console.log('Total articles before sorting:', filteredArticles.length);

      // Sort by published date
      return filteredArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Combined News Service Error:', error);
      return allArticles;
    }
  },

  async getTopHeadlines(): Promise<Article[]> {
    try {
      const [newsAPIHeadlines, guardianArticles, nyTimesArticles] = await Promise.all([
        newsAPIService.getTopHeadlines({ country: 'us' }),
        guardianAPIService.searchArticles({ 'order-by': 'newest' }),
        nyTimesAPIService.searchArticles({ sort: 'newest' }),
      ]);

      const allArticles = [...newsAPIHeadlines, ...guardianArticles, ...nyTimesArticles];
      return allArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Top Headlines Error:', error);
      return [];
    }
  },
}; 