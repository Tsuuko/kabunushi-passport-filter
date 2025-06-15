# 株主パスポート企業検索

株主パスポート参加企業を証券コードまたは企業名で検索できるWebアプリケーションです。

🔗 https://kabu-passport.tsuuko.dev/

## 機能

- **企業検索**: 証券コード・企業名による検索
- **複数検索**: カンマ・改行区切りでの複数企業同時検索  
- **あいまい検索**: ON/OFF切り替え可能な部分マッチ検索
- **株式会社省略対応**: あいまい検索OFF時も「光フード」→「光フードサービス株式会社」に対応
- **リアルタイム検索**: 入力と同時に検索結果更新
- **入力クリア**: ×ボタンでの一括クリア機能
- **検索統計**: 入力件数/ヒット数の表示
- **データ更新日表示**: 画面右上に表示
- **レスポンシブ対応**: PC・モバイル両対応

## 開発環境のセットアップ

### 必要な環境

- Node.js 18以上
- pnpm（推奨）

### インストール

```bash
# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動（Turbopack使用）
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

`src/app/page.tsx` を編集することでページを変更できます。ファイルを編集すると自動的にページが更新されます。

### その他のコマンド

```bash
# プロダクション用ビルド
pnpm build

# プロダクションサーバーの起動
pnpm start

# コードの品質チェック
pnpm lint
```

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS v4
- **フォント**: Geist (Sans & Mono)
- **リンター**: oxlint
- **パッケージマネージャー**: pnpm

## プロジェクト構成

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx           # メインページ
│   └── globals.css        # グローバルスタイル
├── components/
│   └── Footer.tsx         # フッターコンポーネント
└── features/
    └── company-search/
        ├── components/    # 検索関連コンポーネント
        ├── hooks/        # カスタムフック
        ├── types/        # TypeScript型定義
        └── utils/        # ユーティリティ関数

public/
├── list.jsonc           # 企業データ
└── favicon.svg         # ファビコン
```

## データ形式

企業データは `public/list.jsonc` で管理されています：

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

## 検索仕様

### あいまい検索ON（デフォルト）
- 部分マッチ検索
- 「光フード」→「光フードサービス株式会社」がヒット

### あいまい検索OFF
- 完全一致検索
- 株式会社省略対応（「光フード」→「光フードサービス株式会社」がヒット）
- 前株・後株両対応（「コロワイド」→「株式会社 コロワイド」がヒット）

## デプロイ

### 本番環境

このアプリケーションは以下のURLでアクセスできます：
- **URL**: https://kabu-passport.tsuuko.dev/
- **ホスティング**: 自動デプロイ設定済み

### 自分でデプロイする場合

このNext.jsアプリケーションをデプロイする最も簡単な方法は、Next.jsの作成者による [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

詳細については、[Next.jsデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご確認ください。

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
