# System Architecture Philosophy | システム設計思想

## 1. データベース不保持の原則 | DB-less Principle

本プラットフォームは、自前で中央集権的なデータベース（RDB等）を保持しません。
The platform does not maintain a centralized database (e.g., RDB) of its own.

- **理由 | Rationale**: 保守コストの削減、情報の一次ソース（SNS/API）との同期ズレ防止、セキュリティリスクの最小化。
- **実装 | Implementation**:
  - 静的な定義は `data/*.json` で管理。
  - 動的なキャッシュやユーザー設定は **Netlify Blobs** またはブラウザの **localStorage** を使用。

---

## 2. 外部ソース第一主義 | External Source First

情報は「生み出された場所」を一次情報源（Source of Truth）とします。
External platforms are treated as the primary "Source of Truth" where information is created.

- **フロー | Flow**: RSS/APIを通じて外部から取得し、LuckyFields.Lab は「交通整理」と「表示」に徹します。
- **再利用性 | Reusability**: 取得したデータは特定のアプリに固執せず、プラットフォーム全体で共有可能な形式でキャッシュします。

---

## 3. 破綻に強い設計 (フォールバック) | Fault-Tolerant Design (Fallback)

外部サービスやデータが欠落しても、システム全体が停止しない設計を徹底します。
Ensure the entire system remains functional even if external services or data are missing.

- **デフォルト値 | Defaults**: コード内に最小限の動作を保証する静的データを保持。フォールバックUIの提供。
- **不一致の許容 | Tolerance**: データ構造が一部変更されても、エラーにならず「未知の項目」として処理する柔軟なパーサー。

---

## 4. AIエージェント協力前提 | AI Agent Collaborative Foundation

人間だけでなく、AIエージェントが自律的に情報の整理・拡張を行える構造を維持します。
Maintain a structure where AI agents can autonomously organize and extend information.

- **構成 | Composition**:
  - 設定がコードから分離されていること（JSON/YAML）。
  - ドキュメントが自然言語（日本語/英語）で明確に定義されていること。
  - プロンプトから「次に何をすべきか」が自明であること。
