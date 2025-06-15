'use client';

import { SearchForm } from '@/features/company-search/components/SearchForm';
import { SearchResults } from '@/features/company-search/components/SearchResults';
import { useCompanySearch } from '@/features/company-search/hooks/useCompanySearch';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { searchResults, isSearching, hasSearched, searchTermCount, updateTime, search, clearSearch } = useCompanySearch();

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

          <SearchForm 
            onSearch={(input, fuzzySearch) => search(input, fuzzySearch)} 
            isSearching={isSearching} 
            onClear={clearSearch} 
          />

          <div className="mt-8">
            <SearchResults 
              results={searchResults} 
              isLoading={false} 
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
