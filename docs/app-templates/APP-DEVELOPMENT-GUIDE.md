# [アプリケーション名] Development Guide

> このドキュメントは LuckyFields-Platform の共通化方針に基づいて作成されています。
> プラットフォームのドキュメント: https://github.com/LuckyFieldsLLC/LuckyFields-Platform/tree/main/docs

## Project Overview

### Application Purpose
[このアプリケーションの目的と主要機能を記述]

### LuckyFields-Platform Integration
このアプリケーションは以下の LuckyFields-Platform モジュールを使用しています：

```typescript
// 現在使用中のモジュール
import { ... } from '@luckyfields/api-utils';
import { ... } from '@luckyfields/ui-components';
import { ... } from '@luckyfields/hooks';
// [使用しているモジュールをリストアップ]

// 今後使用予定のモジュール
// import { ... } from '@luckyfields/ai-utils';
// import { ... } from '@luckyfields/diagnostics';
```

## Development Philosophy: 共通化とコンパクト設計

### 基本方針
このプロジェクトは LuckyFields エコシステムの一部として、以下の開発哲学に従います：

#### 1. **Platform First（プラットフォーム優先）**
- 新機能実装前に LuckyFields-Platform に既存の解決策がないか確認
- 汎用的な機能は Platform への提案を検討
- アプリ固有の機能のみをローカルに実装

#### 2. **共通化の判断基準**
以下の場合は Platform モジュール化を検討：
- [ ] 他の LuckyFields アプリでも使用される可能性が高い
- [ ] 50行以上の汎用的なロジック
- [ ] 外部API連携やデータ変換処理
- [ ] 共通のビジネスルールやバリデーション
- [ ] UIコンポーネントやデザインパターン

#### 3. **コンパクト実装**
- 必要最小限の依存関係
- 明確で単一の責任を持つコンポーネント/関数
- テスト可能で保守しやすいコード構造

### Platform への貢献プロセス

#### Step 1: 共通化候補の特定
```typescript
// 例：このような処理が他のアプリでも必要そうな場合
const formatUserDisplayName = (user: User): string => {
  return user.nickname || `${user.firstName} ${user.lastName}`;
};

// → @luckyfields/user-utils への提案を検討
```

#### Step 2: Platform チームへの提案
1. GitHub Issue で機能提案を作成
2. 使用ケースと他アプリでの需要を説明
3. 簡単なAPI設計案を提示
4. Platform チームと実装方針を協議

#### Step 3: Platform 実装後の移行
1. Platform モジュールが公開されたら優先的に採用
2. 既存のローカル実装を Platform モジュールに置換
3. 移行完了後、ローカル実装を削除

## Code Organization

### Recommended Folder Structure
```
src/
├── components/          # アプリ固有のUIコンポーネント
│   ├── common/         # アプリ内で再利用されるコンポーネント
│   └── pages/          # ページ固有のコンポーネント
├── hooks/              # アプリ固有のカスタムフック
├── utils/              # アプリ固有のユーティリティ関数
├── types/              # アプリ固有の型定義
├── constants/          # アプリ固有の定数
├── services/           # アプリ固有のビジネスロジック
└── config/             # アプリ固有の設定
```

### What Should NOT Be in This Repository
以下は Platform で提供すべき機能です：
- [ ] 汎用的なAPIクライアント
- [ ] 共通のUIコンポーネント（Button, Input, Modal等）
- [ ] 共通のReactフック（useApi, useAuth等）
- [ ] ファイルアップロード/ダウンロード処理
- [ ] 設定管理やバリデーション
- [ ] エラーハンドリングパターン

## Development Guidelines

### Before Adding New Code
新しいコードを追加する前に以下をチェック：

```typescript
// チェックリスト
const newCodeChecklist = {
  platformCheck: "Platform に既存の解決策はないか？",
  reusability: "他のアプリでも使える可能性はあるか？",
  complexity: "50行以上の複雑なロジックではないか？",
  patterns: "既存のアプリ内パターンと一致しているか？",
  testing: "テスト可能な設計になっているか？"
};
```

### Platform Module Usage Examples

#### API Integration
```typescript
// ✅ Good: Platform モジュールを使用
import { createApiClient } from '@luckyfields/api-utils';
import { useApiData } from '@luckyfields/hooks';

const apiClient = createApiClient({
  baseUrl: process.env.REACT_APP_API_URL,
  timeout: 10000
});

const MyComponent = () => {
  const { data, loading, error } = useApiData('/api/my-data');
  // アプリ固有のレンダリングロジック
};

// ❌ Bad: 独自のAPI実装
const customFetch = async (url: string) => {
  // 重複実装
};
```

#### UI Components
```typescript
// ✅ Good: Platform コンポーネントをベースに
import { Button, Card } from '@luckyfields/ui-components';

const MyFeature = () => (
  <Card>
    <Button variant="primary" onClick={handleAction}>
      アプリ固有のアクション
    </Button>
  </Card>
);

// ❌ Bad: 独自のボタン実装
const CustomButton = styled.button`
  // 重複実装
`;
```

### Contributing Back to Platform

#### When to Propose New Modules
- アプリ内で汎用的なパターンが確立された時
- 他のアプリでも同様の需要が予想される時
- 外部サービス連携で共通化できそうな時

#### How to Propose
1. **Issue作成**: LuckyFields-Platform リポジトリに機能提案Issue
2. **RFC（Request for Comments）**: 簡単な設計書を提出
3. **プロトタイプ**: ローカルで実装し、動作確認
4. **移行計画**: Platform 実装後の移行手順を計画

## Quality Standards

### Code Quality
- TypeScript strict mode 必須
- ESLint/Prettier による自動フォーマット
- 80%以上のテストカバレッジ
- Platform モジュールと同等の品質基準

### Performance Standards
- バンドルサイズの最適化
- Platform モジュールの適切な Tree-shaking
- 不要な依存関係の排除
- パフォーマンス測定と改善

### Documentation
- README.md の定期更新
- Platform モジュール使用方法の記録
- アプリ固有の機能ドキュメント
- 共通化候補の継続的な記録

## Migration Checklist

### Platform Module Adoption
新しい Platform モジュールがリリースされた際：

- [ ] リリースノートと機能を確認
- [ ] 現在のアプリで置換可能な箇所を特定
- [ ] 移行計画を作成（段階的移行推奨）
- [ ] テストとQA実施
- [ ] 旧実装の削除
- [ ] ドキュメント更新

### Legacy Code Cleanup
定期的に以下を実施：

- [ ] 未使用のユーティリティ関数削除
- [ ] Platform で提供開始された機能の置換
- [ ] 重複コードの特定と整理
- [ ] 共通化候補の Platform チームへの提案

## Team Communication

### Platform Team との連携
- **Weekly Sync**: Platform チームとの定期ミーティング
- **Slack Channel**: #luckyfields-platform での日常的な相談
- **GitHub Issues**: 正式な機能要求や不具合報告
- **RFCs**: 大きな変更の提案と議論

### Best Practices Sharing
- 他のアプリチームとのベストプラクティス共有
- Platform 使用事例の社内発表
- 共通課題の協力解決

---

## Application-Specific Notes

[ここにアプリケーション固有の特記事項を記載]

### Used Platform Modules
[現在使用している Platform モジュールの詳細]

### Planned Integrations
[今後統合予定の Platform モジュール]

### Local Implementations for Platform Consideration
[Platform への提案候補となるローカル実装]

---

*Last updated: 2025-10-09*  
*Template version: 1.0*  
*Based on: LuckyFields-Platform Development Philosophy*