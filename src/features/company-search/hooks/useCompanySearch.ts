'use client';

import { useState, useEffect } from 'react';
import { Company } from '../types/company';
import { parseJSON, searchCompanies, parseSearchInput } from '../utils/csvParser';
import { SEARCH_CONFIG } from '../constants/config';

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

  const search = async (input: string, fuzzySearch: boolean = true) => {
    if (!input.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchTermCount(0);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    const searchTerms = parseSearchInput(input);
    setSearchTermCount(searchTerms.length);
    const results = searchCompanies(companies, searchTerms, fuzzySearch);
    setSearchResults(results);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
    setSearchTermCount(0);
  };

  const retry = () => {
    if (retryCount < SEARCH_CONFIG.MAX_RETRY_COUNT) {
      setRetryCount(prev => prev + 1);
    }
  };

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
    search,
    clearSearch,
    retry
  };
}