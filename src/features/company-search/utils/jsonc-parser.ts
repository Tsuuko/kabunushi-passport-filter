/**
 * JSONC (JSON with Comments) パーサー
 * コメントを除去してJSONとして解析する
 */

interface ParseResult<T> {
  data: T | null;
  error: string | null;
}

/**
 * JSONCテキストからコメントを除去する
 * @param text JSONCテキスト
 * @returns コメントが除去されたJSONテキスト
 */
function removeComments(text: string): string {
  let result = '';
  let i = 0;
  let inString = false;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let escapeNext = false;

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    // エスケープ文字の処理
    if (escapeNext) {
      result += char;
      escapeNext = false;
      i++;
      continue;
    }

    // 文字列内の処理
    if (inString) {
      if (char === '\\') {
        escapeNext = true;
        result += char;
      } else if (char === '"') {
        inString = false;
        result += char;
      } else {
        result += char;
      }
      i++;
      continue;
    }

    // 単行コメント内の処理
    if (inSingleLineComment) {
      if (char === '\n' || char === '\r') {
        inSingleLineComment = false;
        result += char; // 改行は保持
      }
      i++;
      continue;
    }

    // 複数行コメント内の処理
    if (inMultiLineComment) {
      if (char === '*' && nextChar === '/') {
        inMultiLineComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    // コメント開始の検出
    if (char === '/' && nextChar === '/') {
      inSingleLineComment = true;
      i += 2;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      inMultiLineComment = true;
      i += 2;
      continue;
    }

    // 文字列開始の検出
    if (char === '"') {
      inString = true;
    }

    result += char;
    i++;
  }

  return result;
}

/**
 * JSONCテキストを解析する
 * @param text JSONCテキスト
 * @returns 解析結果
 */
export function parseJSONC<T>(text: string): ParseResult<T> {
  try {
    // 入力検証
    if (typeof text !== 'string') {
      return {
        data: null,
        error: 'Input must be a string'
      };
    }

    if (!text.trim()) {
      return {
        data: null,
        error: 'Input is empty'
      };
    }

    // コメントを除去
    const cleanText = removeComments(text);

    // JSONとして解析
    const data = JSON.parse(cleanText) as T;

    return {
      data,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown parsing error'
    };
  }
}

/**
 * JSONCテキストの妥当性をチェックする
 * @param text JSONCテキスト
 * @returns 妥当性チェック結果
 */
export function validateJSONC(text: string): { isValid: boolean; error?: string } {
  const result = parseJSONC(text);
  return {
    isValid: result.error === null,
    error: result.error || undefined
  };
}