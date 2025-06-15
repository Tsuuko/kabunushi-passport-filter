import { lazy, Suspense } from 'react';
import { Company } from '../types/company';

// 遅延読み込み用のローディングコンポーネント
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">読み込み中...</span>
  </div>
);

// 仮想化検索結果コンポーネントの遅延読み込み
const LazyVirtualizedSearchResults = lazy(() =>
  import('./VirtualizedSearchResults').then((module) => ({
    default: module.VirtualizedSearchResults,
  })),
);

// 統計情報コンポーネントの遅延読み込み
const LazyStatsPanel = lazy(() =>
  import('./StatsPanel').then((module) => ({
    default: module.StatsPanel,
  })),
);

// エクスポート用のラッパーコンポーネント
interface LazyVirtualizedSearchResultsProps {
  results: Company[];
  isLoading: boolean;
  hasSearched?: boolean;
  searchTermCount?: number;
}

export function LazyVirtualizedSearchResultsWrapper(
  props: LazyVirtualizedSearchResultsProps,
) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyVirtualizedSearchResults {...props} />
    </Suspense>
  );
}

interface LazyStatsPanelProps {
  stats: {
    totalCompanies: number;
    cacheSize: number;
    hasData: boolean;
  };
  onClearCache: () => void;
}

export function LazyStatsPanelWrapper(props: LazyStatsPanelProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyStatsPanel {...props} />
    </Suspense>
  );
}
