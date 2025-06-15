'use client';

import { useState, useEffect } from 'react';

interface SearchFormProps {
  onSearch: (input: string, fuzzySearch?: boolean) => void;
  isSearching: boolean;
  onClear?: () => void;
}

export function SearchForm({ onSearch, isSearching, onClear }: SearchFormProps) {
  const [input, setInput] = useState('');
  const [fuzzySearch, setFuzzySearch] = useState(true);

  const handleClear = () => {
    setInput('');
    onClear?.();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(input, fuzzySearch);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input, fuzzySearch, onSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="company-codes" className="block text-lg font-medium text-gray-900">
            企業検索
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="fuzzy-search"
              checked={fuzzySearch}
              onChange={(e) => setFuzzySearch(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="fuzzy-search" className="text-sm text-gray-700">
              あいまい検索
            </label>
          </div>
        </div>
        <div className="relative">
          <textarea
            id="company-codes"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="企業コードまたは企業名を入力（改行・カンマ区切り）&#10;例: 138A, 1420, 147A&#10;または&#10;光フードサービス, ソラコム"
            className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            disabled={isSearching}
          />
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="クリア"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {isSearching && (
          <div className="text-center text-gray-600 text-sm">
            検索中...
          </div>
        )}
      </div>
    </div>
  );
}