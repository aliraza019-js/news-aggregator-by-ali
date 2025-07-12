/**
 * Guardian API Service
 * @author Ali Raza
 */

import axios from 'axios';
import { Article, GuardianAPIResponse } from '../types';
import { API_KEYS, API_BASE_URLS, API_CONFIG } from '../constants';
import { detectCategoryFromContent } from '../utils/categoryUtils';

export class GuardianApiService {
  private readonly baseUrl = API_BASE_URLS.GUARDIAN_API;
  private readonly apiKey = API_KEYS.GUARDIAN_API;

  async searchArticles(params: {
    q?: string;
    section?: string;
    'from-date'?: string;
    'to-date'?: string;
    'order-by'?: string;
    page?: number;
  }): Promise<Article[]> {
    try {
      const response = await axios.get<GuardianAPIResponse>(`${this.baseUrl}/search`, {
        params: {
          ...params,
          'api-key': this.apiKey,
          'show-fields': 'thumbnail,bodyText',
          'page-size': API_CONFIG.PAGE_SIZE,
        },
      });

      return this.transformArticles(response.data.response.results);
    } catch (error) {
      console.error('Guardian API Error:', error);
      return [];
    }
  }

  private transformArticles(articles: any[]): Article[] {
    return articles.map((article) => ({
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
      category: detectCategoryFromContent(
        article.webTitle,
        article.fields?.bodyText?.substring(0, 200) || '',
        article.fields?.bodyText || ''
      ),
    }));
  }
}

export const guardianApiService = new GuardianApiService(); 