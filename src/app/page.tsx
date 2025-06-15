'use client';

import { SearchForm } from '@/features/company-search/components/SearchForm';
import { SearchResults } from '@/features/company-search/components/SearchResults';
import { useCompanySearch } from '@/features/company-search/hooks/useCompanySearch';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { 
    searchResults, 
    isSearching, 
    hasSearched, 
    searchTermCount, 
    updateTime, 
    error, 
    canRetry, 
    isLoading,
    search, 
    clearSearch, 
    retry 
  } = useCompanySearch();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {updateTime && (
            <div className="text-right mb-4">
              <span className="text-sm text-gray-500">
                データ更新日: {updateTime}
              </span>
            </div>
          )}
          
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              株主パスポート企業検索
            </h1>
            <p className="text-gray-600">
              証券コードまたは企業名から参加企業を検索できます
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    データの読み込みに失敗しました
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  {canRetry && (
                    <div className="mt-3">
                      <button
                        onClick={retry}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        再試行
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <SearchForm 
            onSearch={(input, fuzzySearch) => search(input, fuzzySearch)} 
            isSearching={isSearching} 
            onClear={clearSearch} 
          />

          <div className="mt-8">
            <SearchResults 
              results={searchResults} 
              isLoading={isLoading} 
              hasSearched={hasSearched} 
              searchTermCount={searchTermCount}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
