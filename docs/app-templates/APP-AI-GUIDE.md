# AI Agent Guide for LuckyFields Applications

> このドキュメントは各 LuckyFields アプリケーションで AI エージェント（GitHub Copilot, LM Studio, NotebookLM等）が効果的に開発支援するためのガイドです。

## Application Context Understanding

### What should AI agents know about this application?

**Q: このアプリケーションの役割は？**  
A: [このアプリケーション名] は LuckyFields エコシステムの一部として、[主要機能] を提供するアプリケーションです。LuckyFields-Platform の共通モジュールを活用し、効率的で一貫性のある開発を行っています。

**Q: LuckyFields-Platform との関係は？**  
A: このアプリケーションは以下のように Platform と統合されています：

```typescript
// 使用中の Platform モジュール
import { ... } from '@luckyfields/api-utils';      // API通信
import { ... } from '@luckyfields/ui-components';  // UIコンポーネント
import { ... } from '@luckyfields/hooks';          // React フック
// [実際に使用しているモジュールを記載]

// アプリ固有の実装
src/
├── components/     // アプリ特有のコンポーネント
├── pages/         // ページコンポーネント
├── utils/         // アプリ固有のユーティリティ
└── services/      // ビジネスロジック
```

## AI Code Generation Guidelines

### Platform-First Development
**Q: 新しい機能を実装する際に AI はどう支援すべき？**  
A: 以下の優先順序で提案してください：

```typescript
// 1. Platform モジュールの使用を最優先
// ✅ Good: Platform モジュールを活用
import { Button, Modal } from '@luckyfields/ui-components';
import { useApiData } from '@luckyfields/hooks';

const MyFeature = () => {
  const { data, loading } = useApiData('/api/my-endpoint');
  
  return (
    <Modal>
      <Button onClick={handleAction}>Action</Button>
    </Modal>
  );
};

// 2. Platform にない場合のみアプリ固有実装
// ただし、共通化の可能性を常に考慮
const AppSpecificComponent = () => {
  // アプリ固有のロジック
  // 注意: 他のアプリでも使える可能性があれば Platform 提案を検討
};
```

### Commonality Assessment
**Q: コード生成時に共通化の可能性をどう評価すべき？**  
A: 以下の基準で評価し、適切にコメントを追加：

```typescript
// AI が生成するコードの例
const processUserData = (userData: UserData) => {
  // NOTE: この処理は他のアプリでも使用される可能性があります
  // 50行以上の場合は @luckyfields/user-utils への移行を検討してください
  
  // アプリ固有の処理のみここに実装
  return processedData;
};

// AI コメント例
// TODO: 以下の処理が他のアプリでも必要になった場合
// Platform チームに @luckyfields/validation-utils として提案してください
const validateEmailFormat = (email: string): boolean => {
  // 汎用的なバリデーションロジック
};
```

### Code Quality Standards
**Q: AI が生成するコードの品質基準は？**  
A: Platform と同等の品質基準を維持：

```typescript
// ✅ AI が生成すべきコードの例
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export const UserProfileCard: React.FC<{ profile: UserProfile }> = ({ 
  profile 
}) => {
  const { data, error } = useApiData(`/api/users/${profile.id}`);
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  return (
    <Card>
      <Typography variant="h3">{profile.name}</Typography>
      <Typography variant="body">{profile.email}</Typography>
    </Card>
  );
};

// ❌ AI が避けるべきコード
const UserCard = (props: any) => {
  // 型なし、エラーハンドリングなし
  return <div>{props.name}</div>;
};
```

## Platform Integration Assistance

### When to Suggest Platform Modules
**Q: AI はいつ Platform モジュールの使用を提案すべき？**  
A: 以下の場合に積極的に提案：

```typescript
// ケース1: API通信
// ❌ Bad: カスタム fetch 実装を提案
const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

// ✅ Good: Platform モジュールを提案
import { useApiData } from '@luckyfields/hooks';
const { data, loading, error } = useApiData('/api/endpoint');

// ケース2: UI コンポーネント
// ❌ Bad: カスタムボタン実装
const CustomButton = styled.button`...`;

// ✅ Good: Platform コンポーネント使用
import { Button } from '@luckyfields/ui-components';
<Button variant="primary">Action</Button>

// ケース3: 共通ロジック
// ❌ Bad: ローカル実装
const formatDate = (date: Date) => { /* 独自実装 */ };

// ✅ Good: Platform ユーティリティ確認を提案
// "date formatting については @luckyfields/date-utils を確認してください"
```

### Suggesting New Platform Modules
**Q: AI はいつ新しい Platform モジュールを提案すべき？**  
A: 以下の条件で提案を検討：

```typescript
// 提案すべきケース
const complexBusinessLogic = () => {
  // 50行以上の複雑なロジック
  // かつ他のアプリでも使用されそうな処理
  
  // AI コメント：
  // "この処理は他のアプリでも有用かもしれません。
  //  Platform チームに @luckyfields/business-utils として提案を検討してください。"
};

// 提案しなくて良いケース
const appSpecificLogic = () => {
  // アプリ固有のビジネスロジック
  // 他のアプリでの再利用可能性が低い
};
```

## Development Workflow Support

### Code Review Assistance
**Q: AI はコードレビューでどのような観点を重視すべき？**  
A: 以下の観点でレビューを支援：

```typescript
// レビューチェックポイント
const reviewChecklist = {
  platformUsage: "Platform モジュールを適切に使用しているか？",
  commonality: "共通化できる処理が含まれていないか？",
  quality: "TypeScript strict mode に準拠しているか？",
  testing: "テスト可能な設計になっているか？",
  documentation: "必要な場合ドキュメントが更新されているか？",
  performance: "不要な依存関係や処理はないか？"
};
```

### Refactoring Suggestions
**Q: AI はリファクタリングをどう支援すべき？**  
A: Platform モジュールの活用を重視：

```typescript
// Before: ローカル実装
const validateForm = (formData: FormData) => {
  // 独自のバリデーション実装
};

// AI リファクタリング提案:
// "バリデーション処理は @luckyfields/validation-utils の使用を検討してください"
import { validateForm } from '@luckyfields/validation-utils';

// または Platform にない場合：
// "このバリデーション処理は他のアプリでも有用です。
//  Platform への追加を提案してください。"
```

## Application-Specific Guidance

### [アプリケーション固有のAIガイドライン]

```typescript
// このセクションは各アプリケーションで具体的に記載
// 例：kids-daily-quiz の場合

// 教育コンテンツ関連の処理
const educationSpecificLogic = {
  quizGeneration: "クイズ生成ロジックはアプリ固有",
  progressTracking: "学習進捗は @luckyfields/analytics-utils を検討",
  userManagement: "@luckyfields/user-utils を使用",
  // ...
};
```

### Domain-Specific Patterns
**Q: このアプリケーションのドメイン固有パターンは？**  
A: [各アプリケーションのドメイン固有パターンを記載]

```typescript
// 例：教育アプリの場合
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// AI は教育関連のパターンを理解し、適切な型定義を提案
```

## Error Handling & Debugging

### Platform Module Issues
**Q: Platform モジュールでエラーが発生した場合は？**  
A: 以下の手順で対応を提案：

1. **Platform モジュールのバージョン確認**
2. **使用方法が正しいかドキュメント確認**
3. **既知の問題ではないか GitHub Issues 確認**
4. **再現可能な最小例での検証**
5. **Platform チームへの報告**

### Debugging Workflow
```typescript
// AI が提案すべきデバッグアプローチ
const debuggingSteps = {
  1: "Platform モジュールの使用方法を確認",
  2: "アプリ固有の実装をチェック",
  3: "型エラーや lint エラーを解消",
  4: "テストを実行して動作確認",
  5: "必要に応じて Platform チームに相談"
};
```

## Best Practices for AI Assistance

### Do's
- Platform モジュールの使用を最優先で提案
- 共通化の可能性を常に考慮
- TypeScript strict mode 準拠のコード生成
- 適切なエラーハンドリングを含む
- テスト可能な構造での実装

### Don'ts
- Platform にある機能の重複実装
- 型安全性を犠牲にした実装
- 過度に複雑な独自実装
- ドキュメント化されていないパターン
- パフォーマンスを考慮しない実装

## Communication with Platform Team

### When to Escalate
以下の場合は Platform チームとの相談を提案：

- Platform モジュールのバグや制限に遭遇
- 新機能で Platform 提案が必要
- 既存実装の Platform 移行を検討
- パフォーマンスや設計の課題

### How to Communicate
```typescript
// AI が提案すべきコミュニケーション方法
const communicationChannels = {
  urgent: "Slack #luckyfields-platform for immediate issues",
  feature: "GitHub Issues for feature requests",
  discussion: "Weekly sync meetings for architectural decisions",
  documentation: "PR comments for documentation improvements"
};
```

---

*Application AI Guide version: 1.0*  
*Last updated: 2025-10-09*  
*Based on: LuckyFields-Platform AI-QA.md*

---

## Template Usage Instructions

このテンプレートを各アプリケーションで使用する際は：

1. `[アプリケーション名]` を実際のアプリ名に置換
2. `[主要機能]` にアプリの主要機能を記載
3. 使用中の Platform モジュールを正確に記載
4. アプリケーション固有のパターンとガイドラインを追加
5. ドメイン固有の型定義や規約を記載