# Documentation Guidelines | ドキュメント記述ガイドライン

## 1. 原則 | Principles

### 1.1 日本語第一・多言語併記 | Japanese First, Multilingual Parallel

すべてのドキュメント（計画、タスク管理、完了報告、仕様書）は**日本語を正**として作成し、その直下に対応言語（主に英語）を併記します。これにより、AIエージェントのコンテキスト切り替えや、異なる言語環境での一貫性を保ちます。

All documents (plans, tasks, reports, specs) must be written in **Japanese as the primary language**, followed by the corresponding language (mainly English). This ensures consistency across AI contexts and different language environments.

### 1.2 再利用可能なモジュール構造 | Reusable Modular Structure

ドキュメントは「設計思想」「コンポーネント仕様」「操作ガイド」など、機能ごとにモジュール化して記述します。これにより、開発資料としてだけでなく、アプリ内の「ヘルプ画面」や「開発者モード」へそのまま転用できるようにします。

Documents should be modularized by function (e.g., Design Philosophy, Component Specs, Operation Guides). This allows them to be reused not only as dev materials but also directly in app "Help screens" or "Developer modes."

---

## 2. 記述プロトコル | Writing Protocol

### 2.1 セクション構成 | Section Structure

各セクションは以下の順序で記述します。

1. 日本語見出し
2. 日本語内容
3. (水平線 `---` または改行)
4. 対応言語（英語等）の見出し・内容

Each section should follow this order:

1. Japanese Header
2. Japanese Content
3. (Horizontal rule `---` or newline)
4. English (or other) Header/Content

### 2.2 ファイル管理 | File Management

- **docs/**: 基盤となる設計思想、ポリシー、恒久的なドキュメント
- **tasks/**: 進行中のプロジェクトごとのタスク、計画、完了報告（日本語第一）
- **apps/[app-name]/docs/**: アプリ固有、あるいはヘルプ転用前提の資料

- **docs/**: Core philosophy, policies, permanent docs.
- **tasks/**: Tasks, plans, and reports per project (Japanese-first).
- **apps/[app-name]/docs/**: App-specific materials or help content.

---

## 3. 設計思想の明文化ルール | Philosophy Documentation Rules

開発資料には、必ず以下の観点を「システム側からも参照可能」な形式で含めます。
System-side accessible docs must include these perspectives:

1. **データソースの所在 (Source of Truth)**: DB不保持、外部API/RSS依存などの定義
2. **例外処理方針 (Fault Tolerance)**: データ欠損時のフォールバック挙動
3. **拡張パス (Extension Path)**: 将来的な自動化や機能追加の想定

4. **Source of Truth**: No DB, external API/RSS dependency definitions.
5. **Fault Tolerance**: Fallback behavior for missing data.
6. **Extension Path**: Assumptions for future automation/additions.
