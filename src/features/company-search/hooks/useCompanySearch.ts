'use client';

import { useState, useEffect } from 'react';
import { Company } from '../types/company';
import { parseJSON, searchCompanies, parseSearchInput } from '../utils/csvParser';

export function useCompanySearch() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTermCount, setSearchTermCount] = useState(0);
  const [updateTime, setUpdateTime] = useState('');

  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);
      const { companies, updateTime } = await parseJSON();
      setCompanies(companies);
      setUpdateTime(updateTime);
      setIsLoading(false);
    };

    loadCompanies();
  }, []);

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

  return {
    companies,
    searchResults,
    isLoading,
    isSearching,
    hasSearched,
    searchTermCount,
    updateTime,
    search,
    clearSearch
  };
}