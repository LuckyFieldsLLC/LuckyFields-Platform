# LuckyFields.Lab MVP 運用ガイド (v0.1)

LuckyFields.Lab v0.1 は、データベースを使用せず `data/*.json` を Source-of-truth とするデータ駆動型の静的サイトです。

## 1. データの更新方法

情報の追加・修正は、ルートディレクトリの `data/` フォルダ内の JSON を編集することで行います。

### 制作物の追加 (`data/projects.json`)

```json
{
  "id": "unique-id",
  "title": "作品名",
  "category": "Applications | Creative AI | Media",
  "persona": ["Dev", "Media", etc],
  "featured": true, // トップにピン留めする場合
  "description": {
    "ja": "日本語説明",
    "en": "English description"
  },
  "links": [
    { "type": "github | demo", "url": "https://..." }
  ],
  "tags": ["Tag1", "Tag2"]
}
```

### アカウント・リンクの追加 (`data/accounts.json`)

SNSや外部サービスのリンクを管理します。

### サイト基本設定 (`data/site_settings.json`)

サイト名やデフォルト言語を管理します。

## 2. 多言語対応

- 現在、表示ラベルや説明文は JSON 内の言語コード（`ja`, `en` 等）に紐づいています。
- 言語を追加する場合は `site_settings.json` の `available_langs` に追加し、各データの `description` にその言語のテキストを追加してください。

## 3. デプロイ

GitHub に Push すると、Netlify が自動的に `apps/lab` をビルドしてデプロイします。
ビルドコマンド: `npm run build -w @luckyfields/lab`
出力ディレクトリ: `apps/lab/dist`

## 4. 将来の拡張 (v0.2+)

- Netlify Functions による RSS 自動巡回
- Netlify Blobs による動的なデータ（キャッシュ）保存
- 管理画面からの JSON 更新機能
