import { Company } from '../types/company';

/**
 * 検索インデックス
 * 高速検索のためのデータ構造
 */
export class SearchIndex {
  private codeIndex: Map<string, Company[]> = new Map();
  private nameIndex: Map<string, Company[]> = new Map();
  private furiganaIndex: Map<string, Company[]> = new Map();
  private companies: Company[] = [];

  constructor(companies: Company[]) {
    this.companies = companies;
    this.buildIndex();
  }

  /**
   * インデックスを構築
   */
  private buildIndex() {
    this.companies.forEach((company) => {
      // 企業コードインデックス
      this.addToIndex(this.codeIndex, company.code.toUpperCase(), company);

      // 企業名インデックス（部分文字列も含む）
      const name = company.name.toUpperCase();
      for (let i = 0; i < name.length; i++) {
        for (let j = i + 1; j <= name.length; j++) {
          const substring = name.substring(i, j);
          if (substring.length >= 2) {
            // 2文字以上の部分文字列のみ
            this.addToIndex(this.nameIndex, substring, company);
          }
        }
      }

      // ふりがなインデックス（部分文字列も含む）
      const furigana = company.furigana.toUpperCase();
      for (let i = 0; i < furigana.length; i++) {
        for (let j = i + 1; j <= furigana.length; j++) {
          const substring = furigana.substring(i, j);
          if (substring.length >= 2) {
            // 2文字以上の部分文字列のみ
            this.addToIndex(this.furiganaIndex, substring, company);
          }
        }
      }
    });
  }

  /**
   * インデックスにエントリを追加
   */
  private addToIndex(
    index: Map<string, Company[]>,
    key: string,
    company: Company,
  ) {
    if (!index.has(key)) {
      index.set(key, []);
    }
    const companies = index.get(key)!;
    if (!companies.find((c) => c.code === company.code)) {
      companies.push(company);
    }
  }

  /**
   * 高速あいまい検索
   */
  fuzzySearch(terms: string[]): Company[] {
    const resultSet = new Set<Company>();

    terms.forEach((term) => {
      const upperTerm = term.toUpperCase();

      // 企業コード検索
      const codeMatches = this.codeIndex.get(upperTerm) || [];
      codeMatches.forEach((company) => resultSet.add(company));

      // 企業名検索
      const nameMatches = this.nameIndex.get(upperTerm) || [];
      nameMatches.forEach((company) => resultSet.add(company));

      // ふりがな検索
      const furiganaMatches = this.furiganaIndex.get(upperTerm) || [];
      furiganaMatches.forEach((company) => resultSet.add(company));
    });

    return Array.from(resultSet);
  }

  /**
   * 完全一致検索（株式会社省略対応）
   */
  exactSearch(terms: string[]): Company[] {
    const resultSet = new Set<Company>();

    terms.forEach((term) => {
      const upperTerm = term.toUpperCase();

      this.companies.forEach((company) => {
        if (this.isExactMatch(upperTerm, company)) {
          resultSet.add(company);
        }
      });
    });

    return Array.from(resultSet);
  }

  /**
   * 完全一致判定
   */
  private isExactMatch(term: string, company: Company): boolean {
    const companyCode = company.code.toUpperCase();
    const companyName = company.name.toUpperCase();
    const companyFurigana = company.furigana.toUpperCase();

    // 企業コードの完全一致
    if (companyCode === term) return true;

    // ふりがなの完全一致
    if (companyFurigana === term) return true;

    // 企業名の完全一致
    if (companyName === term) return true;

    // 株式会社省略対応
    return this.matchWithCompanyNameVariations(term, companyName);
  }

  /**
   * 株式会社省略対応のマッチング
   */
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

  /**
   * 株式会社プレフィックスを除去
   */
  private removeCompanyPrefix(companyName: string): string {
    return companyName
      .replace(/株式会社$/, '') // 末尾の株式会社を削除
      .replace(/^株式会社\s*/, '') // 先頭の株式会社（とその後のスペース）を削除
      .trim();
  }

  /**
   * 企業名のバリエーションを生成
   */
  private generateCompanyNameVariations(term: string): string[] {
    return [
      term + '株式会社', // 後株
      '株式会社 ' + term, // 前株（スペース付き）
      '株式会社' + term, // 前株（スペースなし）
    ];
  }

  /**
   * インデックス統計情報を取得
   */
  getStats() {
    return {
      totalCompanies: this.companies.length,
      codeIndexSize: this.codeIndex.size,
      nameIndexSize: this.nameIndex.size,
      furiganaIndexSize: this.furiganaIndex.size,
    };
  }
}
