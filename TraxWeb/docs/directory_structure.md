# TraxWeb ディレクトリ構成

TraxWebプロジェクトのフォルダおよびファイル構成について説明します。

## ソースコード (`TraxWeb/src/`)

| ファイル | 説明 |
| :--- | :--- |
| `index.html` | アプリケーションのエントリーポイント。HTML構造を定義。 |
| `style.css` | アプリケーションのスタイルシート。Vanilla CSSで記述。 |
| `script.js` | ゲームロジック、AI、UI操作を含む主要なJavaScriptファイル。 |

## テスト (`TraxWeb/tests/`)

| フォルダ | 説明 |
| :--- | :--- |
| `unit/` | Jestを使用したユニットテスト（`TraxAI.test.js`, `TraxBoard.test.js`）。 |
| `e2e/` | Playwrightを使用したE2Eテストスクリプト。 |

## ドキュメント (`TraxWeb/docs/`)

プロジェクトの設計や仕様に関するドキュメントが格納されています。

| ファイル/フォルダ | 説明 |
| :--- | :--- |
| `design.md` | 詳細なアプリケーション設計書。クラス設計やシステム構成について記述。 |
| `directory_structure.md` | **本書**。フォルダ構成の説明。 |
| `images/` | ドキュメント内で使用される画像リソース（スクリーンショット等）。 |

## その他

| ファイル/フォルダ | 説明 |
| :--- | :--- |
| `package.json` | プロジェクトの依存関係とスクリプト定義。 |
| `playwright.config.js` | Playwrightの設定ファイル。`tests/e2e` を参照。 |
| `node_modules/` | npm パッケージのインストール先。 |
| `screenshots/` | E2Eテストの実行結果やスクリーンショットの保存先（設定による）。 |
| `test-results/` | Playwright テストの実行結果レポート。 |
