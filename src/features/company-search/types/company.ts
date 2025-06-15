export interface Company {
  code: string;
  name: string;
  furigana: string;
  decisionMonth: number;
  registrationDate: string;
}

export interface RawCompanyData {
  code: string;
  name: string;
  furigana: string;
  decisionMonth: number;
  registrationDate: string;
}

export interface CompanyListData {
  updateTime: string;
  data: RawCompanyData[];
}