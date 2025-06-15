import { Company, CompanyListData } from '../types/company';

export async function parseJSON(): Promise<{ companies: Company[], updateTime: string }> {
  try {
    const response = await fetch('/list.jsonc');
    const jsonText = await response.text();
    
    // JSONCからコメントを除去（簡単な実装）
    const cleanJsonText = jsonText.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    
    const listData: CompanyListData = JSON.parse(cleanJsonText);
    
    const companies: Company[] = listData.data.map(item => ({
      code: item.code,
      name: item.name,
      furigana: item.furigana,
      decisionMonth: item.decisionMonth,
      registrationDate: item.registrationDate
    }));
    
    return { companies, updateTime: listData.updateTime };
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return { companies: [], updateTime: '' };
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