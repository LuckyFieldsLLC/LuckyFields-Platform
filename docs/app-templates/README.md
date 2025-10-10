# LuckyFields Application Templates

> このディレクトリには、各 LuckyFields アプリケーションで共通化方針を導入するためのドキュメントテンプレートが含まれています。

## 📁 テンプレート一覧

### 1. **APP-DEVELOPMENT-GUIDE.md**
**目的**: アプリケーション開発の基本指針と Platform 連携ガイド  
**対象**: 開発者全員  
**内容**:
- Platform モジュールの使用方法
- 共通化の判断基準とプロセス
- コード品質基準
- Platform への貢献方法

### 2. **COMMONALITY-CHECKLIST.md**  
**目的**: 共通化可能性を評価するためのチェックリスト  
**対象**: 開発者（実装時・レビュー時）  
**内容**:
- 新機能実装前のチェック項目
- Platform 提案プロセス
- 定期レビューのガイドライン
- 成功指標とツール

### 3. **APP-AI-GUIDE.md**
**目的**: AI エージェント（Copilot, LM Studio, NotebookLM）向けガイド  
**対象**: AI支援開発環境  
**内容**:
- Platform 優先の開発支援
- 共通化可能性の評価基準
- アプリ固有パターンの理解
- 適切なコード生成のガイドライン

### 4. **APP-SETUP-GUIDE.md**
**目的**: アプリケーションでの共通化方針導入手順  
**対象**: プロジェクトリード、新規チームメンバー  
**内容**:
- テンプレート配置手順
- 開発環境設定
- 段階的移行計画
- チーム教育とプロセス整備

## 🚀 使用方法

### 新規アプリケーションの場合
```bash
# 1. アプリケーションリポジトリで docs ディレクトリ作成
mkdir -p docs

# 2. テンプレートをコピー
cp /LuckyFields-Platform/docs/app-templates/* ./docs/

# 3. アプリケーション固有の情報で更新
# - [アプリケーション名] を実際の名前に置換
# - 使用中の Platform モジュールを正確に記載
# - ドメイン固有のパターンを追加

# 4. 開発チームで共有・教育
```

### 既存アプリケーションの場合
```bash
# 1. APP-SETUP-GUIDE.md の手順に従って段階的に導入
# 2. 既存コードの Platform モジュールへの移行計画を作成
# 3. チーム教育とプロセス変更を実施
```

## 📋 カスタマイズガイド

### 必須カスタマイズ項目
各テンプレートで以下を更新してください：

#### APP-DEVELOPMENT-GUIDE.md
- [ ] `[アプリケーション名]` を実際のアプリ名に置換
- [ ] 使用中の Platform モジュールリストを正確に記載
- [ ] アプリ固有の特記事項を追加
- [ ] プロジェクト構造をアプリの実際の構造に合わせて更新

#### APP-AI-GUIDE.md  
- [ ] ドメイン固有のパターンを記載
- [ ] アプリケーション固有のビジネスロジック説明を追加
- [ ] 型定義や規約をアプリに合わせて記載

#### COMMONALITY-CHECKLIST.md
- [ ] アプリ固有の共通化候補パターンを追加
- [ ] 成功指標をアプリの KPI に合わせて調整

### オプションカスタマイズ
- 開発チーム固有のプロセスや規約の追加
- 特定の技術スタックに関する注意事項
- アプリケーションドメインに特化したベストプラクティス

## 🔄 メンテナンス

### テンプレートの更新
Platform チームが以下の場合にテンプレートを更新します：

- 新しい Platform モジュールの追加
- 開発プロセスの変更
- ベストプラクティスの更新
- AI ツールのアップデート

### アプリケーション側での対応
```bash
# 定期的にテンプレートの更新を確認
git pull origin main
# app-templates/ の変更をチェックし、必要に応じて自アプリのドキュメントを更新
```

## 📊 効果測定

### 導入効果の確認指標
- **Platform モジュール使用率**: 80%以上を目標
- **重複コード削減率**: 月次5%削減を目標  
- **開発効率**: 新機能開発時間20%短縮を目標
- **コード品質**: レビュー指摘事項30%削減を目標

### 測定方法
```bash
# 共通化チェックスクリプトの実行
npm run check-commonality

# Platform モジュール使用状況の確認
npm ls @luckyfields/

# バンドルサイズの分析
npm run analyze-bundle
```

## 🆘 サポート

### 質問・相談
- **Slack**: #luckyfields-platform
- **GitHub Issues**: 各アプリケーションリポジトリまたは Platform リポジトリ
- **週次ミーティング**: Platform チームとの定期同期

### トラブルシューティング
よくある問題と解決策は `APP-SETUP-GUIDE.md` のトラブルシューティングセクションを参照してください。

## 📚 関連ドキュメント

- [PROJECT-GUIDE.md](../PROJECT-GUIDE.md) - Platform 全体概要
- [DEVELOPMENT-POLICY.md](../DEVELOPMENT-POLICY.md) - 開発方針と規約
- [ROADMAP.md](../ROADMAP.md) - Platform ロードマップ
- [AI-QA.md](../AI-QA.md) - AI エージェント向けガイド

---

*Templates version: 1.0*  
*Last updated: 2025-10-09*  
*Maintained by: LuckyFields Platform Team*