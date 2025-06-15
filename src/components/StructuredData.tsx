export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '株主パスポート企業検索',
    description:
      '証券コードまたは企業名から株主パスポート参加企業を検索できるWebアプリ',
    url: 'https://kabu-passport.tsuuko.dev/',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    creator: {
      '@type': 'Person',
      name: 'tsuuko',
    },
    publisher: {
      '@type': 'Person',
      name: 'tsuuko',
    },
    inLanguage: 'ja-JP',
    featureList: [
      '企業検索（証券コード・企業名）',
      '複数検索（カンマ・改行区切り）',
      'あいまい検索（ON/OFF切り替え）',
      '株式会社省略対応',
      'リアルタイム検索',
      '入力クリア機能',
      '検索統計表示',
      'レスポンシブ対応',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
