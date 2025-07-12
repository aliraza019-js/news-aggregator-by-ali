/**
 * NewsAPI Service
 * @author Ali Raza
 */

import axios from 'axios';
import { Article, NewsAPIResponse } from '../types';
import { API_KEYS, API_BASE_URLS, API_CONFIG, SOURCE_MAP } from '../constants';
import { detectCategoryFromContent } from '../utils/categoryUtils';

export class NewsApiService {
  private readonly baseUrl = API_BASE_URLS.NEWS_API;
  private readonly apiKey = API_KEYS.NEWS_API;

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
      const response = await axios.get<NewsAPIResponse>(`${this.baseUrl}/everything`, {
        params: {
          ...params,
          apiKey: this.apiKey,
          language: API_CONFIG.LANGUAGE,
          pageSize: API_CONFIG.PAGE_SIZE,
        },
      });

      return this.transformArticles(response.data.articles);
    } catch (error) {
      console.error('NewsAPI Error:', error);
      return [];
    }
  }

  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    page?: number;
  }): Promise<Article[]> {
    try {
      const response = await axios.get<NewsAPIResponse>(`${this.baseUrl}/top-headlines`, {
        params: {
          ...params,
          apiKey: this.apiKey,
          pageSize: API_CONFIG.PAGE_SIZE,
        },
      });

      return this.transformArticles(response.data.articles);
    } catch (error) {
      console.error('NewsAPI Headlines Error:', error);
      return [];
    }
  }

  getSourceId(sourceName: string): string | null {
    return SOURCE_MAP[sourceName as keyof typeof SOURCE_MAP] || null;
  }

  private transformArticles(articles: any[]): Article[] {
    return articles.map((article, index) => ({
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
  }
}

export const newsApiService = new NewsApiService(); 