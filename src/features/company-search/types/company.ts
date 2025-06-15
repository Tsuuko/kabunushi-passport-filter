export interface Company {
  code: string;
  name: string;
  furigana: string;
  decisionMonth: number;
  registrationDate: string;
}

// RawCompanyDataはCompanyと同一構造のため、型エイリアスとして定義
export type RawCompanyData = Company;

export interface CompanyListData {
  updateTime: string;
  data: RawCompanyData[];
}