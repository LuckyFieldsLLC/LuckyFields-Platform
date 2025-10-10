# LuckyFields Application Setup Guide

> このガイドは既存または新規の LuckyFields アプリケーションに共通化方針を導入するための手順書です。

## セットアップ概要

このセットアップにより、各アプリケーションが LuckyFields-Platform の共通化方針に従って開発されるようになります。

### 対象アプリケーション
- kids-daily-quiz
- minsei-app  
- sekikenzai-system
- 今後作成される新規アプリケーション

## Step 1: ドキュメント配置

### 1.1 ドキュメントディレクトリの作成
```bash
# アプリケーションリポジトリで実行
mkdir -p docs
cd docs
```

### 1.2 テンプレートファイルのコピー
以下のテンプレートを各アプリケーションの `docs/` ディレクトリにコピー：

```bash
# LuckyFields-Platform から以下をコピー
cp /LuckyFields-Platform/docs/app-templates/APP-DEVELOPMENT-GUIDE.md ./DEVELOPMENT-GUIDE.md
cp /LuckyFields-Platform/docs/app-templates/COMMONALITY-CHECKLIST.md ./COMMONALITY-CHECKLIST.md
cp /LuckyFields-Platform/docs/app-templates/APP-AI-GUIDE.md ./AI-GUIDE.md
```

### 1.3 アプリケーション固有の情報更新
各ファイルで以下を更新：

1. **DEVELOPMENT-GUIDE.md**
   - `[アプリケーション名]` を実際のアプリ名に置換
   - 使用中の Platform モジュールリストを正確に記載
   - アプリ固有の特記事項を追加

2. **AI-GUIDE.md** 
   - ドメイン固有のパターンを記載
   - アプリケーション固有のビジネスロジックの説明
   - 使用中の Platform モジュール情報を更新

## Step 2: 開発環境の設定

### 2.1 ESLint Rules の追加
Platform モジュールの使用を推奨する ESLint ルールを追加：

```javascript
// .eslintrc.js に追加
module.exports = {
  rules: {
    // Platform モジュール使用を推奨
    'prefer-platform-modules': 'warn',
    // 重複実装を検出
    'no-duplicate-implementations': 'error',
  },
  // カスタムルールの定義
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        // Platform にある機能の独自実装を警告
        'no-custom-api-client': 'warn',
        'no-custom-ui-components': 'warn',
      }
    }
  ]
};
```

### 2.2 VS Code 設定
`.vscode/settings.json` を設定：

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "typescript.suggest.includeAutomaticOptionalChainCompletions": true,
  
  // Platform モジュールを優先して提案
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.includeCompletionsForModuleExports": true,
  
  // コードスニペット設定
  "emmet.includeLanguages": {
    "typescript": "typescriptreact"
  }
}
```

### 2.3 Code Snippets の追加
`.vscode/luckyfields.code-snippets` を作成：

```json
{
  "Platform API Hook": {
    "prefix": "lf-api",
    "body": [
      "import { useApiData } from '@luckyfields/hooks';",
      "",
      "const { data, loading, error } = useApiData('$1');",
      "",
      "if (loading) return <Loading />;",
      "if (error) return <ErrorMessage error={error} />;",
      "",
      "return (",
      "  <div>",
      "    {/* $2 */}",
      "  </div>",
      ");"
    ],
    "description": "LuckyFields Platform API hook pattern"
  },
  
  "Platform UI Component": {
    "prefix": "lf-ui",
    "body": [
      "import { $1 } from '@luckyfields/ui-components';",
      "",
      "<$1$2>",
      "  $3",
      "</$1>"
    ],
    "description": "LuckyFields Platform UI component"
  }
}
```

## Step 3: Package.json の更新

### 3.1 Dependencies の整理
現在のアプリケーションの依存関係を確認し、Platform モジュールで置換可能なものを特定：

```json
{
  "dependencies": {
    // Platform モジュールを追加
    "@luckyfields/api-utils": "^1.0.0",
    "@luckyfields/ui-components": "^1.0.0", 
    "@luckyfields/hooks": "^1.0.0",
    "@luckyfields/config-utils": "^1.0.0",
    
    // 既存の依存関係で置換可能なものを削除予定としてコメント
    // "axios": "^1.0.0", // → @luckyfields/api-utils で置換予定
    // "react-hook-form": "^7.0.0", // → @luckyfields/hooks で置換予定
  },
  
  "scripts": {
    // 共通化チェック用スクリプト
    "check-commonality": "node scripts/check-commonality.js",
    "platform-update": "npm update @luckyfields/*"
  }
}
```

### 3.2 共通化チェックスクリプト
`scripts/check-commonality.js` を作成：

```javascript
const fs = require('fs');
const path = require('path');

// 重複実装や共通化候補を検出するスクリプト
const checkCommonality = () => {
  console.log('🔍 共通化候補をチェック中...');
  
  // src ディレクトリを再帰的にスキャン
  const srcDir = path.join(process.cwd(), 'src');
  const files = getAllFiles(srcDir, ['.ts', '.tsx']);
  
  const issues = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // 共通化候補のパターンを検出
    const patterns = [
      { pattern: /fetch\(.*\)/, message: 'API通信: @luckyfields/api-utils の使用を検討' },
      { pattern: /styled\.(button|input|div)/, message: 'UIコンポーネント: @luckyfields/ui-components の使用を検討' },
      { pattern: /useState.*api/, message: 'API状態管理: @luckyfields/hooks の使用を検討' },
    ];
    
    patterns.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        issues.push({ file, message });
      }
    });
  });
  
  // 結果出力
  if (issues.length > 0) {
    console.log('\n⚠️  共通化候補が見つかりました:');
    issues.forEach(({ file, message }) => {
      console.log(`  ${file}: ${message}`);
    });
  } else {
    console.log('✅ 共通化候補は見つかりませんでした');
  }
};

const getAllFiles = (dir, extensions) => {
  // ディレクトリを再帰的にスキャンする実装
  // ...
};

checkCommonality();
```

## Step 4: コードの段階的移行

### 4.1 移行計画の作成
現在のコードベースを分析し、移行計画を作成：

```markdown
# 移行計画

## Phase 1: 低リスクモジュールの置換
- [ ] API通信 → @luckyfields/api-utils
- [ ] 設定管理 → @luckyfields/config-utils  
- [ ] 基本UIコンポーネント → @luckyfields/ui-components

## Phase 2: 中リスクモジュールの置換
- [ ] カスタムフック → @luckyfields/hooks
- [ ] エラーハンドリング → @luckyfields/diagnostics

## Phase 3: 高リスクモジュールの置換
- [ ] 複雑なビジネスロジック
- [ ] 外部サービス連携

## 共通化候補の Platform 提案
- [ ] [具体的な機能名] - 複雑度: 高, 再利用性: 高
- [ ] [具体的な機能名] - 複雑度: 中, 再利用性: 中
```

### 4.2 移行実施例

#### API通信の移行
```typescript
// Before: 独自実装
const fetchUserData = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// After: Platform モジュール使用
import { useApiData } from '@luckyfields/hooks';

const UserProfile = ({ userId }: { userId: string }) => {
  const { data, loading, error } = useApiData(`/api/users/${userId}`);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <UserCard user={data} />;
};
```

## Step 5: チーム教育とプロセス整備

### 5.1 チーム研修
- **Platform 概要説明**: 目的、メリット、使用方法
- **開発フロー説明**: 新機能開発時の手順
- **共通化判断**: チェックリストの使用方法
- **ハンズオン**: 実際のコード移行体験

### 5.2 プロセス整備
```markdown
# 開発プロセスへの組み込み

## PR作成時
- [ ] 共通化チェックリストの確認
- [ ] Platform モジュール使用の検討
- [ ] 新機能の Platform 提案可能性の評価

## コードレビュー時  
- [ ] Platform モジュール使用の推奨
- [ ] 重複実装の指摘
- [ ] 共通化候補の議論

## 週次振り返り
- [ ] 共通化候補の整理
- [ ] Platform への提案検討
- [ ] 移行進捗の確認
```

### 5.3 コミュニケーション設定
- **Slack チャンネル**: `#luckyfields-[app-name]` でアプリ固有の議論
- **定期ミーティング**: Platform チームとの週次同期
- **Issue管理**: GitHub Projects での進捗管理

## Step 6: 継続的改善

### 6.1 メトリクス設定
```javascript
// パフォーマンス測定
const metrics = {
  platformModuleUsage: "Platform モジュール使用率",
  duplicateCodeReduction: "重複コード削減率", 
  developmentSpeed: "新機能開発速度",
  bugFixTime: "バグ修正時間",
  developerSatisfaction: "開発者満足度"
};
```

### 6.2 定期レビュー
- **月次**: コードベース分析と共通化候補の特定
- **四半期**: Platform との統合状況レビュー
- **半年**: 開発効率とコード品質の評価

## トラブルシューティング

### よくある問題と解決策

#### 1. Platform モジュールのバージョン競合
```bash
# 解決策: 依存関係の整理
npm ls @luckyfields/
npm update @luckyfields/*
```

#### 2. 型定義の不一致
```typescript
// 解決策: 型定義の統一
import type { User } from '@luckyfields/types';
// アプリ固有の拡張
interface AppUser extends User {
  appSpecificField: string;
}
```

#### 3. パフォーマンス問題
```typescript
// 解決策: 適切な Tree-shaking
import { specificFunction } from '@luckyfields/utils/specificFunction';
// 全体インポートは避ける
// import * as utils from '@luckyfields/utils';
```

## 成功事例と学習リソース

### 成功事例
- [アプリケーション名]: Platform モジュール使用により開発時間30%短縮
- [機能名]: 共通化により3つのアプリで同時改善実現

### 学習リソース
- [LuckyFields-Platform Documentation](../PROJECT-GUIDE.md)
- [Video Tutorial: Platform Integration Best Practices]
- [Code Examples Repository]

---

*Setup Guide version: 1.0*  
*Last updated: 2025-10-09*  
*For support: contact Platform Team*