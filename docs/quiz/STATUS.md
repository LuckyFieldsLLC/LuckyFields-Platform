# Quiz Module — Status (2025-10-11)

## 現状サマリ
- クイズ機能は「一時段階の開発完了（MVP到達）」とします。
- データ保存は以下の最低限ユーティリティを実装:
  - AES-GCM 暗号化/復号 (Web Crypto API) — `utils/cryptoUtils.ts`
  - localStorage 管理 — `utils/localStorageManager.ts`
  - ファイル入出力 (FS Access API + フォールバック) — `utils/fileSystemHandler.ts`
- UI も最小構成を配置:
  - 保存/読込/削除/エクスポート/インポート — `components/StoragePanel.tsx`
  - Functions 同期呼び出し — `components/SyncButton.tsx`
- サーバ側（Netlify Functions）:
  - `/syncQuizzes` — JSON を { type: 'json' } で保存/読込
  - `/status` — ヘルスチェック用

## 運用状況
- デプロイ: Netlify (publish: `docs`, functions: `netlify/functions`)
- ルートは `/dashboard/` に誘導（`docs/_redirects` と `docs/index.html` で対応）
- GitHub Actions: `Health Check` が外部URLと内部APIを定期監視

## 次にやらないこと（スコープ外）
- クイズの大規模機能拡張
- 本格認証・課金連携

## 次フェーズへ
- プラットフォーム部のダッシュボード作り込みへ移行します。
