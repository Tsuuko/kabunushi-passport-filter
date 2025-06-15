// 検索関連の設定値
export const SEARCH_CONFIG = {
  // デバウンス時間（ミリ秒）
  DEBOUNCE_DELAY: 300,
  
  // リトライ設定
  MAX_RETRY_COUNT: 3,
  
  // データファイルパス
  DATA_FILE_PATH: '/list.jsonc',
} as const;

// UI関連の設定値
export const UI_CONFIG = {
  // 検索結果のグリッド設定
  GRID_BREAKPOINTS: {
    sm: 'sm:grid-cols-1',
    md: 'md:grid-cols-2', 
    lg: 'lg:grid-cols-3',
  },
  
  // アニメーション設定
  TRANSITION_DURATION: 'transition-colors',
} as const;