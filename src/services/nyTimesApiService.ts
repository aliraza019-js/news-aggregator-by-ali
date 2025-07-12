/**
 * NY Times API Service
 * @author Ali Raza
 */

import axios from 'axios';
import { Article, NYTimesAPIResponse } from '../types';
import { API_KEYS, API_BASE_URLS } from '../constants';
import { detectCategoryFromContent } from '../utils/categoryUtils';

export class NYTimesApiService {
  private readonly baseUrl = API_BASE_URLS.NYTIMES_API;
  private readonly apiKey = API_KEYS.NYTIMES_API;

  async searchArticles(params: {
    q?: string;
    fq?: string;
    begin_date?: string;
    end_date?: string;
    sort?: string;
    page?: number;
  }): Promise<Article[]> {
    try {
      const response = await axios.get<NYTimesAPIResponse>(`${this.baseUrl}/search/v2/articlesearch.json`, {
        params: {
          ...params,
          'api-key': this.apiKey,
        },
      });

      return this.transformArticles(response.data.response.docs);
    } catch (error) {
      console.error('NY Times API Error:', error);
      return [];
    }
  }

  private transformArticles(articles: any[]): Article[] {
    return articles.map((article, index) => ({
      id: `nytimes-${index}`,
      title: article.headline.main,
      description: article.abstract || '',
      content: article.lead_paragraph || '',
      url: article.web_url,
      urlToImage: this.getImageUrl(article.multimedia),
      publishedAt: article.pub_date,
      source: {
        id: 'nytimes',
        name: 'The New York Times',
      },
      author: article.byline?.original || '',
      category: detectCategoryFromContent(
        article.headline.main,
        article.abstract || '',
        article.lead_paragraph || ''
      ),
    }));
  }

  private getImageUrl(multimedia: any[]): string {
    if (!multimedia || multimedia.length === 0) return '';
    
    const image = multimedia.find(media => media.subtype === 'thumbnail');
    return image ? `https://www.nytimes.com/${image.url}` : '';
  }
}

export const nyTimesApiService = new NYTimesApiService(); 