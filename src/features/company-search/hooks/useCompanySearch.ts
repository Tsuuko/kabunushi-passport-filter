'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Company } from '../types/company';
import { parseJSON, searchCompanies, parseSearchInput } from '../utils/csvParser';
import { SEARCH_CONFIG } from '../constants/config';

// 検索キャッシュの型定義
interface SearchCache {
  [key: string]: Company[];
}

export function useCompanySearch() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTermCount, setSearchTermCount] = useState(0);
  const [updateTime, setUpdateTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchCache, setSearchCache] = useState<SearchCache>({});

  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);
      setError(null);
      
      const { companies, updateTime, error: loadError } = await parseJSON();
      
      if (loadError) {
        setError(loadError);
        // データが空の場合はリトライを提案
        if (companies.length === 0 && retryCount < SEARCH_CONFIG.MAX_RETRY_COUNT) {
          console.log(`データ読み込み失敗、リトライ可能 (${retryCount + 1}/${SEARCH_CONFIG.MAX_RETRY_COUNT})`);
        }
      } else {
        setRetryCount(0); // 成功時はリトライカウントをリセット
      }
      
      setCompanies(companies);
      setUpdateTime(updateTime);
      setIsLoading(false);
    };

    loadCompanies();
  }, [retryCount]);

  // 検索キーを生成する関数
  const generateSearchKey = useCallback((input: string, fuzzySearch: boolean) => {
    return `${input.trim().toLowerCase()}:${fuzzySearch}`;
  }, []);

  // メモ化された検索関数
  const search = useCallback(async (input: string, fuzzySearch: boolean = true) => {
    if (!input.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchTermCount(0);
      return;
    }

    const searchKey = generateSearchKey(input, fuzzySearch);
    
    // キャッシュから結果を取得
    if (searchCache[searchKey]) {
      const searchTerms = parseSearchInput(input);
      setSearchResults(searchCache[searchKey]);
      setHasSearched(true);
      setSearchTermCount(searchTerms.length);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    // 検索処理を非同期で実行（UIブロッキングを防ぐ）
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const searchTerms = parseSearchInput(input);
    setSearchTermCount(searchTerms.length);
    const results = searchCompanies(companies, searchTerms, fuzzySearch);
    
    // 結果をキャッシュに保存
    setSearchCache(prev => ({
      ...prev,
      [searchKey]: results
    }));
    
    setSearchResults(results);
    setIsSearching(false);
  }, [companies, searchCache, generateSearchKey]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setHasSearched(false);
    setSearchTermCount(0);
  }, []);

  const retry = useCallback(() => {
    if (retryCount < SEARCH_CONFIG.MAX_RETRY_COUNT) {
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount]);

  // キャッシュクリア関数
  const clearCache = useCallback(() => {
    setSearchCache({});
  }, []);

  // メモ化された統計情報
  const stats = useMemo(() => ({
    totalCompanies: companies.length,
    cacheSize: Object.keys(searchCache).length,
    hasData: companies.length > 0
  }), [companies.length, searchCache]);

  return {
    companies,
    searchResults,
    isLoading,
    isSearching,
    hasSearched,
    searchTermCount,
    updateTime,
    error,
    canRetry: retryCount < SEARCH_CONFIG.MAX_RETRY_COUNT,
    stats,
    search,
    clearSearch,
    retry,
    clearCache
  };
}