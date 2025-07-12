# News Aggregator Frontend

A modern React TypeScript application that aggregates news from multiple sources with personalized content filtering.

## Author
**Ali Raza**

## Features

- **Multi-Source News Aggregation**: Integrates with NewsAPI, The Guardian, and The New York Times
- **Personalized Content Filtering**: User preferences for sources, categories, and authors
- **Advanced Search & Filtering**: Keyword search, category filtering, date ranges, and sorting
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Clean Architecture**: Follows SOLID principles and best practices

## Best Practices Implemented

### 1. SOLID Principles
- **Single Responsibility**: Each service handles one API (NewsAPI, Guardian, NYTimes)
- **Open/Closed**: Services are extensible without modification
- **Liskov Substitution**: Consistent interfaces across services
- **Interface Segregation**: Focused, specific interfaces
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### 2. DRY (Don't Repeat Yourself)
- Centralized constants in `src/constants/index.ts`
- Reusable utility functions in `src/utils/`
- Shared components and hooks

### 3. KISS (Keep It Simple, Stupid)
- Clear, readable code structure
- Minimal complexity in components
- Straightforward data flow

### 4. Clean Code
- No AI-generated comments
- Meaningful variable and function names
- Proper error handling
- Type safety throughout

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ArticleCard.tsx
│   ├── ArticleList.tsx
│   ├── PreferencesPanel.tsx
│   └── SearchAndFilter.tsx
├── constants/          # Application constants
│   └── index.ts
├── context/           # React context providers
│   └── UserPreferencesContext.tsx
├── pages/             # Page components
│   └── NewsPage.tsx
├── services/          # API services
│   ├── newsApiService.ts
│   ├── guardianApiService.ts
│   ├── nyTimesApiService.ts
│   └── combinedNewsService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── utils/             # Utility functions
    ├── categoryUtils.ts
    ├── filterUtils.ts
    ├── storageUtils.ts
    └── textUtils.ts
```

## Key Components

### Services Architecture
- **Individual Services**: Each API has its own service class
- **Combined Service**: Orchestrates all services using Facade pattern
- **Error Handling**: Graceful fallbacks and error recovery
- **Type Safety**: Full TypeScript implementation

### State Management
- **React Context**: User preferences and global state
- **Local Storage**: Persistent user preferences
- **Optimized Re-renders**: Proper dependency management

### Filtering System
- **Multi-level Filtering**: User preferences + search filters
- **Category Detection**: AI-powered content categorization
- **Performance Optimized**: Efficient filtering algorithms

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Build
```bash
npm run build
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Type Checking
```bash
npm run type-check
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_NEWS_API_KEY=8af7a63d89574077a420361aa7fed8e0
REACT_APP_GUARDIAN_API_KEY=7af3990b-eb7c-443f-a468-508049f84464
REACT_APP_NYTIMES_API_KEY=lpRJgOjU6LRaadr5RrlqIuLzPZ1XW03P
```

## API Keys

The application uses three news APIs:
- **NewsAPI**: https://newsapi.org/
- **The Guardian**: https://open-platform.theguardian.com/
- **The New York Times**: https://developer.nytimes.com/

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo and useMemo for expensive operations
- **Debounced Search**: Optimized search input handling
- **Efficient Filtering**: Optimized filter algorithms
- **Image Optimization**: Graceful image error handling

## Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels and semantic HTML

## Contributing

1. Follow the existing code structure
2. Maintain type safety
3. Write clean, readable code
4. Test your changes
5. Follow the established patterns

## License

This project is licensed under the MIT License.
