import { Company } from '../types/company';
import { SearchIndex } from './search-index';

/**
 * 検索戦略の基底インターフェース
 */
interface SearchStrategy {
  search(companies: Company[], searchTerms: string[]): Company[];
}

/**
 * あいまい検索戦略（部分マッチ）
 */
class FuzzySearchStrategy implements SearchStrategy {
  search(companies: Company[], searchTerms: string[]): Company[] {
    const normalizedTerms = searchTerms.map((term) =>
      term.trim().toUpperCase(),
    );

    return companies.filter((company) => {
      const companyCode = company.code.toUpperCase();
      const companyName = company.name.toUpperCase();
      const companyFurigana = company.furigana.toUpperCase();

      return normalizedTerms.some(
        (term) =>
          companyCode.includes(term) ||
          companyName.includes(term) ||
          companyFurigana.includes(term),
      );
    });
  }
}

/**
 * 完全一致検索戦略（株式会社省略対応）
 */
class ExactSearchStrategy implements SearchStrategy {
  search(companies: Company[], searchTerms: string[]): Company[] {
    const normalizedTerms = searchTerms.map((term) =>
      term.trim().toUpperCase(),
    );

    return companies.filter((company) => {
      const companyCode = company.code.toUpperCase();
      const companyName = company.name.toUpperCase();
      const companyFurigana = company.furigana.toUpperCase();

      return normalizedTerms.some((term) =>
        this.isExactMatch(term, companyCode, companyName, companyFurigana),
      );
    });
  }

  private isExactMatch(
    term: string,
    companyCode: string,
    companyName: string,
    companyFurigana: string,
  ): boolean {
    // 企業コードの完全一致
    if (companyCode === term) return true;

    // ふりがなの完全一致
    if (companyFurigana === term) return true;

    // 企業名の完全一致
    if (companyName === term) return true;

    // 株式会社省略対応
    return this.matchWithCompanyNameVariations(term, companyName);
  }

  private matchWithCompanyNameVariations(
    term: string,
    companyName: string,
  ): boolean {
    // 株式会社を省略した企業名との一致
    const companyNameWithoutKK = this.removeCompanyPrefix(companyName);
    if (companyNameWithoutKK === term) return true;

    // 検索語に株式会社を付けた場合の一致
    const variations = this.generateCompanyNameVariations(term);
    return variations.some((variation) => companyName === variation);
  }

  private removeCompanyPrefix(companyName: string): string {
    return companyName
      .replace(/株式会社$/, '') // 末尾の株式会社を削除
      .replace(/^株式会社\s*/, '') // 先頭の株式会社（とその後のスペース）を削除
      .trim();
  }

  private generateCompanyNameVariations(term: string): string[] {
    return [
      term + '株式会社', // 後株
      '株式会社 ' + term, // 前株（スペース付き）
      '株式会社' + term, // 前株（スペースなし）
    ];
  }
}

/**
 * インデックス付き高速検索戦略
 */
class IndexedSearchStrategy implements SearchStrategy {
  private searchIndex: SearchIndex;

  constructor(companies: Company[]) {
    this.searchIndex = new SearchIndex(companies);
  }

  search(companies: Company[], searchTerms: string[]): Company[] {
    // インデックスを使用した高速検索（companiesパラメータは無視）
    return this.searchIndex.fuzzySearch(searchTerms);
  }

  exactSearch(searchTerms: string[]): Company[] {
    return this.searchIndex.exactSearch(searchTerms);
  }

  getStats() {
    return this.searchIndex.getStats();
  }
}

/**
 * 検索戦略ファクトリー
 */
export class SearchStrategyFactory {
  private static indexedStrategy: IndexedSearchStrategy | null = null;

  static createStrategy(
    fuzzySearch: boolean,
    companies?: Company[],
  ): SearchStrategy {
    // 大量データの場合はインデックス付き検索を使用
    if (companies && companies.length > 100) {
      if (
        !this.indexedStrategy ||
        this.indexedStrategy.getStats().totalCompanies !== companies.length
      ) {
        this.indexedStrategy = new IndexedSearchStrategy(companies);
      }

      if (fuzzySearch) {
        return this.indexedStrategy;
      } else {
        // 完全一致検索用のラッパー
        return {
          search: (_, searchTerms: string[]) =>
            this.indexedStrategy!.exactSearch(searchTerms),
        };
      }
    }

    // 少量データの場合は従来の検索を使用
    return fuzzySearch ? new FuzzySearchStrategy() : new ExactSearchStrategy();
  }

  static clearCache() {
    this.indexedStrategy = null;
  }
}

/**
 * 検索実行関数
 */
export function executeSearch(
  companies: Company[],
  searchTerms: string[],
  fuzzySearch: boolean = true,
): Company[] {
  const strategy = SearchStrategyFactory.createStrategy(fuzzySearch, companies);
  return strategy.search(companies, searchTerms);
}
