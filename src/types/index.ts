export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author?: string;
  category?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

export interface FilterOptions {
  keyword: string;
  category: string;
  source: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'relevancy' | 'popularity' | 'publishedAt';
}

export interface UserPreferences {
  preferredSources: string[];
  preferredCategories: string[];
  preferredAuthors: string[];
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface GuardianAPIResponse {
  response: {
    status: string;
    total: number;
    results: Array<{
      id: string;
      type: string;
      sectionId: string;
      sectionName: string;
      webPublicationDate: string;
      webTitle: string;
      webUrl: string;
      apiUrl: string;
      fields?: {
        thumbnail?: string;
        bodyText?: string;
      };
    }>;
  };
}

export interface NYTimesAPIResponse {
  status: string;
  copyright: string;
  response: {
    docs: Array<{
      _id: string;
      headline: {
        main: string;
      };
      abstract: string;
      lead_paragraph: string;
      web_url: string;
      pub_date: string;
      byline: {
        original: string;
      };
      multimedia: Array<{
        url: string;
        subtype: string;
      }>;
      section_name: string;
    }>;
    meta: {
      hits: number;
    };
  };
} 