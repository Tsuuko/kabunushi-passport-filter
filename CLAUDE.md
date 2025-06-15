# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack (preferred)
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server  
- `pnpm lint` - Run oxlint to check code quality

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS v4.

**Key Structure:**
- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with metadata, fonts, and lang configuration
- `src/app/page.tsx` - Homepage component with search functionality
- `src/app/globals.css` - Global styles with Tailwind imports and CSS custom properties
- `src/components/` - Shared UI components (Footer)

**Technology Stack:**
- Next.js 15.3.3 with App Router
- React 19
- TypeScript 5 with strict mode
- Tailwind CSS v4 with PostCSS
- Geist font family (Sans and Mono variants)
- oxlint for fast linting

**Import Aliases:**
- `@/*` maps to `./src/*` for cleaner imports

The project uses pnpm as the package manager and is configured for modern React development with strict TypeScript settings.

## 株主パスポート検索Webアプリケーション

### 概要
株主パスポート参加企業を証券コードまたは企業名で検索できるWebアプリケーション。

### 実装済み機能
- ✅ **企業検索**: 証券コード・企業名による検索
- ✅ **複数検索**: カンマ・改行区切りでの複数企業同時検索  
- ✅ **あいまい検索**: ON/OFF切り替え可能な部分マッチ検索
- ✅ **株式会社省略**: あいまい検索OFF時も「光フード」→「光フードサービス株式会社」対応
- ✅ **リアルタイム検索**: 入力と同時に検索結果更新
- ✅ **入力クリア**: ×ボタンでの一括クリア機能
- ✅ **検索統計**: 入力件数/ヒット数の表示
- ✅ **データ更新日**: 画面右上に表示
- ✅ **0件メッセージ**: 該当なしの場合の適切な案内
- ✅ **レスポンシブ対応**: PC・モバイル両対応
- ✅ **フッター**: GitHub・Xアカウントリンク付き

### データ構造
JSONCファイル (`public/list.jsonc`) で企業データを管理:
```json
{
  "updateTime": "2025-06-15",
  "data": [
    {
      "code": "138A",
      "name": "光フードサービス株式会社", 
      "furigana": "ひかりふーどさーびす",
      "decisionMonth": 11,
      "registrationDate": ""
    }
  ]
}
```

### UI設計
1. **ヘッダーエリア**
   - データ更新日表示（右上）
   - アプリタイトルと説明

2. **検索入力エリア**
   - 企業検索ラベル + あいまい検索チェックボックス
   - textarea（複数行入力対応）
   - クリアボタン（×アイコン）

3. **検索結果表示**
   - 入力件数/ヒット数の統計表示
   - カード形式での企業情報表示
   - 企業コード（青背景バッジ）、会社名、ふりがな、決算月

4. **フッター**
   - コピーライト
   - GitHub・Xアカウントリンク

### 技術構成
- Next.js 15 (App Router)
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- Feature-based ディレクトリ構造
- JSON形式データ管理
- インメモリ検索（高速）

### ディレクトリ構造
```
src/
├── app/
│   ├── layout.tsx          # メタデータ、フォント、言語設定
│   ├── page.tsx           # メインページ（検索UI）
│   └── globals.css        # グローバルスタイル
├── components/
│   └── Footer.tsx         # フッターコンポーネント
└── features/
    └── company-search/
        ├── components/
        │   ├── SearchForm.tsx     # 検索フォーム
        │   ├── CompanyCard.tsx    # 企業カード
        │   └── SearchResults.tsx  # 検索結果表示
        ├── hooks/
        │   └── useCompanySearch.ts # 検索ロジック
        ├── types/
        │   └── company.ts         # TypeScript型定義
        └── utils/
            └── csvParser.ts       # JSON解析・検索機能

public/
├── list.jsonc            # 企業データ（JSONC形式）
├── favicon.svg          # SVGファビコン
└── apple-touch-icon.png # iOS/Android用アイコン
```

### 検索仕様
**あいまい検索ON（デフォルト）:**
- 部分マッチ検索
- 「光フード」→「光フードサービス株式会社」ヒット

**あいまい検索OFF:**
- 完全一致検索
- 株式会社省略対応（「光フード」→「光フードサービス株式会社」ヒット）
- 前株・後株両対応（「コロワイド」→「株式会社 コロワイド」ヒット）

### メタデータ設定
- タイトル: "株主パスポート企業検索"
- 説明: "証券コードまたは企業名から株主パスポート参加企業を検索できるWebアプリケーション"
- 言語: ja (日本語)
- ファビコン: SVG形式
