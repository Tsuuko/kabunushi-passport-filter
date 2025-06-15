import { Company, CompanyListData } from '../types/company';
import { SEARCH_CONFIG } from '../constants/config';
import { parseJSONC } from './jsonc-parser';
import { executeSearch } from './search-strategies';

export async function parseJSON(): Promise<{
  companies: Company[];
  updateTime: string;
  error?: string;
}> {
  try {
    const response = await fetch(SEARCH_CONFIG.DATA_FILE_PATH);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const jsonText = await response.text();

    if (!jsonText.trim()) {
      throw new Error('Empty response received');
    }

    // JSONCパーサーを使用してコメントを除去し解析
    const parseResult = parseJSONC<CompanyListData>(jsonText);

    if (parseResult.error || !parseResult.data) {
      throw new Error(
        `JSONC parse error: ${parseResult.error || 'Failed to parse data'}`,
      );
    }

    const listData = parseResult.data;

    if (!listData || !Array.isArray(listData.data)) {
      throw new Error('Invalid data format: expected object with data array');
    }

    const companies: Company[] = listData.data.map((item, index) => {
      if (!item.code || !item.name) {
        console.warn(`Invalid company data at index ${index}:`, item);
      }
      return {
        code: item.code || '',
        name: item.name || '',
        furigana: item.furigana || '',
        decisionMonth: item.decisionMonth || 0,
        registrationDate: item.registrationDate || '',
      };
    });

    return { companies, updateTime: listData.updateTime || '' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error loading company data:', errorMessage);

    // 開発環境でより詳細なエラー情報を表示
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }

    return {
      companies: [],
      updateTime: '',
      error: errorMessage,
    };
  }
}

export function searchCompanies(
  companies: Company[],
  searchTerms: string[],
  fuzzySearch: boolean = true,
): Company[] {
  return executeSearch(companies, searchTerms, fuzzySearch);
}

export function parseSearchInput(input: string): string[] {
  return input
    .split(/[,\n]+/)
    .map((code) => code.trim())
    .filter((code) => code.length > 0);
}
