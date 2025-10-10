# LuckyFields-Platform Development Policy

## Overview

This document outlines the development standards, branching strategy, commit conventions, and AI usage policies for the LuckyFields-Platform repository. These guidelines ensure code quality, maintainability, and consistent collaboration across the team.

All contributors must follow these policies to maintain the integrity and reliability of the shared platform modules.

## Coding Standards

### TypeScript Guidelines
- **Strict Mode**: All TypeScript must compile with strict mode enabled
- **Type Safety**: Explicit types required; avoid `any` unless absolutely necessary
- **Interface First**: Define interfaces before implementations
- **Functional Style**: Prefer functional programming patterns where appropriate

## Modularization Guidelines

### 共通化の判断基準 (Commonality Assessment Criteria)

開発中に以下の状況が発生した場合、モジュール化を検討する必要があります：

#### 必須モジュール化基準
- **重複コード**: 同じ機能が2つ以上のアプリケーションに存在
- **共通パターン**: 類似の処理フローが複数箇所で実装されている
- **設定管理**: 環境依存の設定や認証情報の管理が必要
- **外部API連携**: 同じ外部サービスとの通信処理

#### 推奨モジュール化基準
- **50行以上の共通コード**: 関数やクラスレベルでの重複
- **型定義の共有**: 複数アプリで同じデータ構造を使用
- **バリデーション**: 同じビジネスルールの検証処理
- **ユーティリティ関数**: 汎用的なヘルパー関数

### モジュール設計原則

#### コンパクト設計 (Compact Design)
```typescript
// ✅ Good: 単一目的、最小依存関係
export interface ApiClientOptions {
  baseUrl: string;
  timeout?: number; // デフォルト値あり
}

export const createApiClient = (options: ApiClientOptions) => {
  const { baseUrl, timeout = 5000 } = options;
  // 最小限の実装
};

// ❌ Bad: 多目的、多すぎる依存関係
export class MegaClient {
  // 複数の責任を持つクラス
}
```

#### 無駄のない実装 (Lean Implementation)
```typescript
// ✅ Good: 必要な機能のみ
export const formatCurrency = (
  amount: number, 
  currency: string = 'JPY'
): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency
  }).format(amount);
};

// ❌ Bad: 使われない機能を含む
export const formatCurrency = (
  amount: number,
  currency: string = 'JPY',
  locale?: string,
  useSymbol?: boolean,
  precision?: number,
  // ... 多すぎるオプション
) => {
  // 複雑すぎる実装
};
```

### Development Workflow Integration

#### モジュール化チェックリスト
開発者は以下のチェックリストを使用してモジュール化の必要性を判断します：

- [ ] この機能は他のアプリでも使用される可能性があるか？
- [ ] 同様のコードが既に他の場所に存在しないか？
- [ ] この処理は単独でテスト可能か？
- [ ] 外部依存関係は最小限に抑えられているか？
- [ ] 設定やカスタマイズが適切に抽象化されているか？

#### モジュール作成プロセス
1. **需要確認**: 複数のアプリケーションでの使用予定を確認
2. **API設計**: 使いやすく拡張可能なAPIを設計
3. **最小実装**: MVPアプローチで必要最小限の機能を実装
4. **テスト作成**: 包括的なユニットテストとインテグレーションテスト
5. **ドキュメント**: 使用例とAPIドキュメントの作成
6. **検証**: 実際のアプリケーションでの動作確認

### Code Style
```typescript
// ✅ Good: Explicit types and clear naming
interface UserConfig {
  apiKey: string;
  timeout: number;
  retryAttempts: number;
}

export const createApiClient = (config: UserConfig): ApiClient => {
  return new ApiClient(config);
};

// ❌ Bad: Implicit types and unclear naming
export const create = (c: any) => {
  return new ApiClient(c);
};
```

### Module Structure
- **Single Responsibility**: Each module should have one clear purpose
- **Export Clarity**: Use named exports; avoid default exports except for main entry points
- **Documentation**: JSDoc comments required for all public APIs
- **Testing**: Minimum 80% test coverage for all modules

### File Organization
```
packages/[module-name]/
├── src/
│   ├── index.ts           # Main export file
│   ├── types.ts           # Type definitions
│   ├── utils/             # Utility functions
│   └── __tests__/         # Test files
├── package.json
├── README.md              # Module documentation
└── tsconfig.json
```

## Branching Strategy

### Branch Types
- **`main`** - Production-ready code, always deployable
- **`develop`** - Integration branch for features
- **`feature/[name]`** - Individual features or enhancements
- **`hotfix/[issue]`** - Critical bug fixes for production
- **`release/[version]`** - Release preparation branches

### Branch Naming Conventions
```bash
# Features
feature/add-blob-encryption
feature/improve-api-error-handling

# Bug fixes
bugfix/fix-config-parsing
bugfix/resolve-memory-leak

# Hotfixes
hotfix/critical-security-patch
hotfix/fix-production-crash

# Releases
release/v1.2.0
release/v2.0.0-beta.1
```

### Workflow Process
1. **Create** feature branch from `develop`
2. **Implement** changes with tests
3. **Push** and create pull request to `develop`
4. **Review** by at least one team member
5. **Merge** after approval and CI passes
6. **Deploy** from `main` after integration testing

## Commit Conventions

### Commit Message Format
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- **`feat`**: New features or functionality
- **`fix`**: Bug fixes
- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, etc.)
- **`refactor`**: Code refactoring without behavior changes
- **`test`**: Adding or updating tests
- **`chore`**: Build process, dependency updates, etc.

### Examples
```bash
feat(api-utils): add retry mechanism for failed requests

fix(blobs-utils): resolve file upload timeout issue

docs(hooks): update useApiClient documentation

refactor(ui-components): extract common button logic

test(diagnostics): add integration tests for error tracking

chore: update TypeScript to v5.0
```

## Pull Request Guidelines

### Requirements
- **Description**: Clear explanation of changes and motivation
- **Testing**: All new code must include appropriate tests
- **Documentation**: Update relevant documentation
- **Breaking Changes**: Clearly marked and justified
- **Review**: At least one approving review required

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes or clearly documented
```

## AI Usage Policy

### Approved AI Tools
- **GitHub Copilot**: Code suggestions and completion
- **LM Studio**: Local AI for documentation and analysis
- **NotebookLM**: Research and documentation generation
- **ChatGPT/Claude**: Code review and architectural discussions

### Guidelines for AI Assistance

#### Code Generation
- **Review Required**: All AI-generated code must be reviewed by a human
- **Understanding**: Developer must understand and be able to explain any AI-suggested code
- **Testing**: AI-generated code requires the same testing standards as human-written code
- **Attribution**: No special attribution required for AI assistance in routine coding

#### Documentation
- **AI-Enhanced**: AI tools encouraged for documentation generation and improvement
- **Fact-Checking**: All AI-generated documentation must be verified for accuracy
- **Context Awareness**: Ensure AI tools have proper context about LuckyFields architecture

#### Architecture Decisions
- **Human-Led**: Major architectural decisions must be made by humans
- **AI Advisory**: AI tools can provide analysis and suggestions
- **Documentation**: Record AI input in architectural decision records

### Prohibited AI Usage
- **Sensitive Data**: Never share proprietary business logic or sensitive data with cloud AI services
- **Blind Acceptance**: Never commit AI-generated code without understanding
- **Security Code**: Extra scrutiny required for AI assistance with security-related code

## Code Review Process

### Review Criteria
- **Functionality**: Code works as intended
- **Quality**: Follows coding standards and best practices
- **Performance**: No obvious performance issues
- **Security**: No security vulnerabilities introduced
- **Maintainability**: Code is readable and well-documented

### Reviewer Responsibilities
- **Timely Response**: Reviews completed within 24 hours during business days
- **Constructive Feedback**: Specific, actionable suggestions
- **Knowledge Transfer**: Share expertise and best practices
- **Testing Verification**: Verify tests are comprehensive and meaningful

## Versioning Strategy

### Semantic Versioning
Follow [SemVer](https://semver.org/) for all modules:
- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

### Release Process
1. **Feature Freeze**: Stop adding features to release branch
2. **Testing**: Comprehensive testing of all modules
3. **Documentation**: Update changelogs and documentation
4. **Tagging**: Create git tags for release
5. **Publishing**: Publish to npm registry
6. **Notification**: Inform application teams of updates

## Quality Assurance

### Automated Checks
- **TypeScript Compilation**: Must compile without errors
- **Linting**: ESLint with strict configuration
- **Testing**: Jest with coverage reporting
- **Security**: npm audit and Snyk scanning
- **Performance**: Bundle size analysis

### Continuous Integration
```yaml
# Example CI checks
- Type checking
- Linting
- Unit tests
- Integration tests
- Security scanning
- Performance benchmarks
- Documentation generation
```

## Emergency Procedures

### Critical Bug Response
1. **Assessment**: Evaluate impact and affected applications
2. **Hotfix Branch**: Create from `main` branch
3. **Minimal Fix**: Implement smallest possible fix
4. **Fast-Track Review**: Expedited review process
5. **Emergency Release**: Deploy and notify immediately

### Security Incident Response
1. **Immediate Assessment**: Determine scope and impact
2. **Containment**: Prevent further exposure
3. **Communication**: Notify stakeholders immediately
4. **Remediation**: Implement fix and verify security
5. **Post-Incident**: Review and improve security processes

---

*Last updated: 2025-10-09*