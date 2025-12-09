# TraxWeb ディレクトリ構成

TraxWebプロジェクトのフォルダおよびファイル構成について説明します。

## ルートディレクトリ (`TraxWeb/`)

| ファイル/フォルダ | 説明 |
| :--- | :--- |
| `index.html` | アプリケーションのエントリーポイント。HTML構造を定義。 |
| `style.css` | アプリケーションのスタイルシート。Vanilla CSSで記述。 |
| `script.js` | ゲームロジック、AI、UI操作を含む主要なJavaScriptファイル。 |
| `package.json` | プロジェクトの依存関係（Jest, Playwright等）とスクリプト定義。 |
| `playwright.config.js` | Playwright（E2Eテスト）の設定ファイル。 |
| `README.md` | プロジェクトの概要とセットアップ手順（ルートのREADMEとは異なる場合がある）。 |

## テスト (`TraxWeb/`)

| ファイル | 説明 |
| :--- | :--- |
| `TraxAI.test.js` | AIロジック（`TraxAI` クラス）のユニットテスト（Jest）。 |
| `TraxBoard.test.js` | 盤面ロジック（`TraxBoard` クラス）のユニットテスト（Jest）。 |

## ドキュメント (`TraxWeb/docs/`)

プロジェクトの設計や仕様に関するドキュメントが格納されています。

| ファイル/フォルダ | 説明 |
| :--- | :--- |
| `design.md` | 詳細なアプリケーション設計書。クラス設計やシステム構成について記述。 |
| `directory_structure.md` | **本書**。フォルダ構成の説明。 |
| `images/` | ドキュメント内で使用される画像リソース（スクリーンショット等）。 |

## E2Eテスト (`TraxWeb/e2e/`)

Playwrightを使用したE2Eテストスクリプトが格納されています。

## その他

| フォルダ | 説明 |
| :--- | :--- |
| `node_modules/` | npm パッケージのインストール先。 |
| `screenshots/` | テスト実行時や手動で取得したスクリーンショットの保存先。 |
| `test-results/` | Playwright テストの実行結果レポート。 |
