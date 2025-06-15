import { Company, CompanyListData } from '../types/company';
import { SEARCH_CONFIG } from '../constants/config';

export async function parseJSON(): Promise<{ companies: Company[], updateTime: string, error?: string }> {
  try {
    const response = await fetch(SEARCH_CONFIG.DATA_FILE_PATH);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const jsonText = await response.text();
    
    if (!jsonText.trim()) {
      throw new Error('Empty response received');
    }
    
    // JSONCからコメントを除去（簡単な実装）
    const cleanJsonText = jsonText.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    
    let listData: CompanyListData;
    try {
      listData = JSON.parse(cleanJsonText);
    } catch (parseError) {
      throw new Error(`JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
    }
    
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
        registrationDate: item.registrationDate || ''
      };
    });
    
    return { companies, updateTime: listData.updateTime || '' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error loading company data:', errorMessage);
    
    // 開発環境でより詳細なエラー情報を表示
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }
    
    return { 
      companies: [], 
      updateTime: '', 
      error: errorMessage 
    };
  }
}

export function searchCompanies(companies: Company[], searchTerms: string[], fuzzySearch: boolean = true): Company[] {
  const normalizedTerms = searchTerms.map(term => term.trim().toUpperCase());
  
  return companies.filter(company => {
    const companyCode = company.code.toUpperCase();
    const companyName = company.name.toUpperCase();
    const companyFurigana = company.furigana.toUpperCase();
    
    if (fuzzySearch) {
      // あいまい検索：部分マッチ
      return normalizedTerms.some(term => 
        companyCode.includes(term) || 
        companyName.includes(term) || 
        companyFurigana.includes(term)
      );
    } else {
      // 完全一致検索（株式会社省略対応）
      return normalizedTerms.some(term => {
        // 企業コードの完全一致
        if (companyCode === term) return true;
        
        // ふりがなの完全一致
        if (companyFurigana === term) return true;
        
        // 企業名の完全一致（株式会社省略対応）
        if (companyName === term) return true;
        
        // 株式会社を省略した企業名との一致
        const companyNameWithoutKK = companyName
          .replace(/株式会社$/, '')    // 末尾の株式会社を削除
          .replace(/^株式会社\s*/, '') // 先頭の株式会社（とその後のスペース）を削除
          .trim();
        
        if (companyNameWithoutKK === term) return true;
        
        // 検索語に株式会社を付けた場合の一致
        const termWithKK = term + '株式会社';
        const kkWithTerm = '株式会社 ' + term;  // スペース付きで追加
        const kkWithTermNoSpace = '株式会社' + term;  // スペースなしでも追加
        
        if (companyName === termWithKK || companyName === kkWithTerm || companyName === kkWithTermNoSpace) return true;
        
        return false;
      });
    }
  });
}

export function parseSearchInput(input: string): string[] {
  return input
    .split(/[,\n]+/)
    .map(code => code.trim())
    .filter(code => code.length > 0);
}