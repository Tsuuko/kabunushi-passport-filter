import { Company } from '../types/company';
import { CompanyCard } from './CompanyCard';

interface SearchResultsProps {
  results: Company[];
  isLoading: boolean;
  hasSearched?: boolean;
  searchTermCount?: number;
}

export function SearchResults({ results, isLoading, hasSearched = false, searchTermCount = 0 }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (results.length === 0 && hasSearched) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-2">該当する企業が見つかりませんでした</p>
        <p className="text-sm text-gray-500 mb-2">
          入力件数: {searchTermCount}件 / ヒット数: 0件
        </p>
        <p className="text-sm text-gray-500">
          企業コード（例：138A）または企業名（例：光フードサービス）で検索してください
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          検索結果
        </h2>
        <p className="text-sm text-gray-600">
          入力件数: {searchTermCount}件 / ヒット数: {results.length}件
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {results.map((company) => (
          <CompanyCard key={company.code} company={company} />
        ))}
      </div>
    </div>
  );
}