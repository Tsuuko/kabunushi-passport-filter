import { useMemo, useState, useEffect, useRef } from 'react';
import { Company } from '../types/company';
import { CompanyCard } from './CompanyCard';

interface VirtualizedSearchResultsProps {
  results: Company[];
  isLoading: boolean;
  hasSearched?: boolean;
  searchTermCount?: number;
}

// 仮想化設定
const ITEM_HEIGHT = 200; // 各アイテムの高さ（px）
const CONTAINER_HEIGHT = 600; // コンテナの高さ（px）
const BUFFER_SIZE = 5; // 表示範囲外のバッファアイテム数

export function VirtualizedSearchResults({ 
  results, 
  isLoading, 
  hasSearched = false, 
  searchTermCount = 0 
}: VirtualizedSearchResultsProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 表示可能なアイテム数を計算
  const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT);
  
  // 現在の表示範囲を計算
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const start = Math.floor(scrollTop / ITEM_HEIGHT);
    const end = Math.min(start + visibleCount + BUFFER_SIZE, results.length);
    const actualStart = Math.max(0, start - BUFFER_SIZE);
    
    return {
      startIndex: actualStart,
      endIndex: end,
      visibleItems: results.slice(actualStart, end)
    };
  }, [scrollTop, results, visibleCount]);

  // スクロールハンドラー
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // 結果が変更された時にスクロール位置をリセット
  useEffect(() => {
    setScrollTop(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [results]);

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

  // 仮想化が必要かどうかを判定
  const shouldVirtualize = results.length > 50;

  if (!shouldVirtualize) {
    // 少数の結果の場合は通常の表示
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

  // 仮想化表示
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          検索結果
        </h2>
        <p className="text-sm text-gray-600">
          入力件数: {searchTermCount}件 / ヒット数: {results.length}件
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ※大量の結果のため仮想化表示を使用しています
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="relative border border-gray-200 rounded-lg overflow-auto"
        style={{ height: CONTAINER_HEIGHT }}
        onScroll={handleScroll}
      >
        {/* 全体の高さを確保するためのスペーサー */}
        <div style={{ height: results.length * ITEM_HEIGHT }}>
          {/* 表示範囲のアイテムのみレンダリング */}
          <div 
            style={{ 
              transform: `translateY(${startIndex * ITEM_HEIGHT}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleItems.map((company, index) => (
              <div 
                key={company.code}
                style={{ height: ITEM_HEIGHT }}
                className="p-4 border-b border-gray-100 last:border-b-0"
              >
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* スクロール位置インジケーター */}
      <div className="text-center text-xs text-gray-500">
        {startIndex + 1} - {Math.min(endIndex, results.length)} / {results.length} 件表示中
      </div>
    </div>
  );
}