import { Company } from '../types/company';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
              {company.code}
            </span>
            {company.registrationDate && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                {company.registrationDate}以降登録可能
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            {company.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {company.furigana}
          </p>
          <p className="text-sm text-gray-500">
            決算月: {company.decisionMonth}月
          </p>
        </div>
      </div>
    </div>
  );
}