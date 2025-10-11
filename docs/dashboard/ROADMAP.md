# Platform Dashboard — Roadmap (2025-10-11)

## 目的
LuckyFields プラットフォームのオペレーションハブとして、以下を可視化・操作できるダッシュボードを構築する。

## スコープ（初期）
- ヘルス状況の可視化
  - GitHub Actions (Health Check) の最新結果
  - Netlify Deploy の最新ステータス
  - Functions `/status` の応答
- データ一覧
  - Netlify Blobs に保存されている最近のレコード（例: repo-health, quizzes）
- 最低限のUI
  - シンプルなカード/テーブルで最新10〜20件の概要表示

## 技術スタック
- 静的ページ: `docs/dashboard/` 配下
- データ取得: Netlify Functions 経由でフェッチ（CORS許可）
- スタイル: Tailwind（任意）/ 最小CSS

## 次の実装タスク（提案）
1. `/dashboard/index.html` を強化
   - セクション: Health, Deploy, Functions status, Blobs recent
   - JS で以下を取得・表示:
     - `/.netlify/functions/status`
     - `/.netlify/functions/repo-health-list`
2. Functions に recent-list エンドポイントを追加
   - 例: `/.netlify/functions/list-blobs?store=repo-health&limit=20`
3. セキュリティ
   - 公開情報のみを扱う（秘匿情報は出さない）
   - 必要なら署名付きURL/限定公開に移行

## マイルストーン
- M1: ダッシュボードの静的UIと2つのデータパネル（status, repo-health-list）
- M2: Blobs 一覧/詳細の閲覧
- M3: 軽い操作（再実行トリガー、掃除など）

## ノート
- 当面は`docs/_redirects`でルートからダッシュボードへ誘導。
