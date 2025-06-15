interface StatsPanelProps {
  stats: {
    totalCompanies: number;
    cacheSize: number;
    hasData: boolean;
  };
  onClearCache: () => void;
}

export function StatsPanel({ stats, onClearCache }: StatsPanelProps) {
  if (!stats.hasData) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-sm">
            <span className="text-blue-700 font-medium">登録企業数:</span>
            <span className="ml-1 text-blue-900 font-semibold">
              {stats.totalCompanies.toLocaleString()}社
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-blue-700 font-medium">検索キャッシュ:</span>
            <span className="ml-1 text-blue-900 font-semibold">
              {stats.cacheSize}件
            </span>
          </div>
        </div>
        
        {stats.cacheSize > 0 && (
          <button
            onClick={onClearCache}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition-colors"
            title="検索キャッシュをクリアしてメモリを解放します"
          >
            キャッシュクリア
          </button>
        )}
      </div>
      
      {stats.cacheSize > 10 && (
        <div className="mt-2 text-xs text-blue-600">
          💡 多くの検索がキャッシュされています。パフォーマンスが向上しています。
        </div>
      )}
    </div>
  );
}