# Docker 環境整備 - 変更内容サマリー

## 実施した改善内容

### 1. Dockerfile の最適化

#### 変更前の問題点

- 開発用設定のみで、本番環境には不適切
- キャッシュレイヤーが効率的でない
- 不要なファイルがすべてコピーされていた

#### 改善内容

- ✅ **マルチステージビルド導入**
  - Builder ステージ: 開発/ビルド時に使用
  - Production ステージ: 本番環境用の軽量イメージ
- ✅ **パッケージ管理の改善**
  - `npm install` → `npm ci` に変更（再現性向上）
  - 本番環境では `--only=production` で依存関係を削減
- ✅ **ヘルスチェック追加**
  - コンテナの正常性を自動監視
- ✅ **Node.js バージョン統一**
  - `node:18-alpine` → `node:20-alpine` に更新

### 2. docker-compose.yml の改善

#### 変更前の問題点

- 開発環境での起動パスが不正確
- ヘルスチェック未設定
- depends_on が単純な条件のみ

#### 改善内容

- ✅ **ビルドコンテキストの修正**
  - `context: .` → `context: ./next` に修正
  - Dockerfile パス指定を相対パスに統一
- ✅ **ヘルスチェック実装**
  - PostgreSQL: `pg_isready` コマンドで監視
  - Next.js: HTTP ヘルスチェック
- ✅ **条件付き依存関係**
  - `depends_on` に `condition: service_healthy` を追加
- ✅ **ネットワーク管理**
  - 専用ネットワーク `nextapp` を作成
  - コンテナ間通信を明示化
- ✅ **コンテナ名の明示化**
  - トラッキング・管理が容易

### 3. 新規ファイル作成

#### `.dockerignore` (Docker ビルド除外設定)

```text
- node_modules, npm-debug.log, .next など不要なファイルを除外
- ビルド時間短縮、イメージサイズ削減
```

#### `docker-compose.override.yml` (開発環境専用設定)

```text
- 開発環境では自動的に読み込まれる
- Builder ステージを使用（高速開発ビルド）
- ホットリロード対応のボリュームマウント
- インタラクティブシェル対応
```

#### `docker-compose.override.yml` (開発環境専用設定)

```text
- 開発環境では自動的に読み込まれる
- Builder ステージを使用（高速開発ビルド）
- ホットリロード対応のボリュームマウント
- インタラクティブシェル対応
```

#### `.env.local` (ローカル開発環境変数)

```text
- Docker コンテナ内での DB 接続設定
- GraphQL エンドポイント設定
- Git に含まれない（.gitignore で除外）
```

#### `.env.docker` (共通 Docker 環境変数)

```text
- プロジェクト全体の Docker 環境設定
- 全開発者で共通の値
- リポジトリにコミット可能
```

### 4. package.json スクリプト追加

```json
"docker:build": "docker-compose -f ../docker/docker-compose.yml build"
"docker:up": "docker-compose -f ../docker/docker-compose.yml up -d"
"docker:down": "docker-compose -f ../docker/docker-compose.yml down"
"docker:logs": "docker-compose -f ../docker/docker-compose.yml logs -f app"
"docker:db:logs": "docker-compose -f ../docker/docker-compose.yml logs -f db"
"docker:shell": "docker-compose -f ../docker/docker-compose.yml exec app sh"
"docker:db:shell": "docker-compose -f ../docker/docker-compose.yml exec db psql -U postgres -d nextapp"
```

### 5. ドキュメント作成

#### DOCKER_SETUP.md

- クイックスタートガイド
- よく使うコマンド集
- トラブルシューティング
- ファイル説明
- 本番環境デプロイ手順

### 6. ルートレベルの .gitignore 作成

```text
- .env, .env.local ファイル除外
- IDE 設定ファイル除外
- Docker ボリュームデータ除外
```

## ディレクトリ構造（最終状態）

```text
NextTest/
├── .gitignore
│
├── docker/                       # Docker 関連をすべてこのフォルダに集約
│   ├── Dockerfile                # マルチステージビルド
│   ├── docker-compose.yml        # 本番・開発共通設定（stdin_open, tty 対応）
│   └── .dockerignore             # ビルド除外設定
│
└── next/
    ├── .env.local                # ローカル環境設定
    ├── package.json              # Docker スクリプト
    ├── src/
    ├── public/
    └── ...
```

## 使用開始手順

### 1. 初回セットアップ

```bash
# docker フォルダから実行するか、next フォルダから npm スクリプトで実行
cd docker
docker-compose up -d

# または next フォルダから
cd next
npm run docker:up
```

### 2. データベースマイグレーション

```bash
# コンテナ内で実行
npm run docker:shell
npx prisma migrate dev --name init
```

### 3. ブラウザでアクセス

```text
http://localhost:3000
```

## 主な改善のメリット

| 項目 | 改善前 | 改善後 |
| --- | --- | --- |
| ビルド速度 | 低速 | マルチステージで高速化 |
| イメージサイズ | 大きい | 本番用で最適化 |
| 開発効率 | 低い | override.yml で高速化 |
| ヘルスチェック | なし | 自動監視 |
| 環境管理 | 複雑 | 明確に分離 |
| トラッキング | 困難 | コンテナ名で管理容易 |

## 次のステップ

1. ✅ Docker 環境の起動確認
2. ✅ データベースマイグレーション実行
3. ✅ アプリケーションの動作確認
4. CI/CD パイプラインへの統合（GitHub Actions など）
5. 本番環境への Docker デプロイ

---

**詳細は `DOCKER_SETUP.md` を参照してください。**
