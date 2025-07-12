/**
 * Combined News Service - Orchestrates all news API services
 * @author Ali Raza
 */

import { Article, FilterOptions } from '../types';
import { newsApiService } from './newsApiService';
import { guardianApiService } from './guardianApiService';
import { nyTimesApiService } from './nyTimesApiService';
import { mapCategoryForAPI } from '../utils/categoryUtils';

export class CombinedNewsService {
  async searchAllSources(params: {
    keyword?: string;
    category?: string;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
  }): Promise<Article[]> {
    const promises: Promise<Article[]>[] = [];

    if (!params.source || params.source === 'NewsAPI') {
      promises.push(
        newsApiService.searchArticles({
          q: params.keyword,
          category: params.category ? mapCategoryForAPI(params.category, 'newsapi') : undefined,
          from: params.dateFrom,
          to: params.dateTo,
          sortBy: params.sortBy,
        })
      );
    }

    if (!params.source || params.source === 'The Guardian') {
      promises.push(
        guardianApiService.searchArticles({
          q: params.keyword,
          section: params.category ? mapCategoryForAPI(params.category, 'guardian') : undefined,
          'from-date': params.dateFrom,
          'to-date': params.dateTo,
          'order-by': params.sortBy === 'publishedAt' ? 'newest' : 'relevance',
        })
      );
    }

    if (!params.source || params.source === 'The New York Times') {
      promises.push(
        nyTimesApiService.searchArticles({
          q: params.keyword,
          fq: params.category ? `section_name:("${mapCategoryForAPI(params.category, 'nytimes')}")` : undefined,
          begin_date: params.dateFrom?.replace(/-/g, ''),
          end_date: params.dateTo?.replace(/-/g, ''),
          sort: params.sortBy === 'publishedAt' ? 'newest' : 'relevance',
        })
      );
    }

    try {
      const results = await Promise.allSettled(promises);
      const articles: Article[] = [];

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          articles.push(...result.value);
        }
      });

      return this.deduplicateArticles(articles);
    } catch (error) {
      console.error('Combined search error:', error);
      return [];
    }
  }

  async getTopHeadlines(): Promise<Article[]> {
    const promises: Promise<Article[]>[] = [
      newsApiService.getTopHeadlines({}),
      guardianApiService.searchArticles({}),
      nyTimesApiService.searchArticles({}),
    ];

    try {
      const results = await Promise.allSettled(promises);
      const articles: Article[] = [];

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          articles.push(...result.value);
        }
      });

      return this.deduplicateArticles(articles);
    } catch (error) {
      console.error('Top headlines error:', error);
      return [];
    }
  }

  private deduplicateArticles(articles: Article[]): Article[] {
    const seen = new Set<string>();
    return articles.filter(article => {
      const key = `${article.title}-${article.source.name}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

export const combinedNewsService = new CombinedNewsService(); 