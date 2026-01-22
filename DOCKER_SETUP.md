# Docker セットアップガイド

このプロジェクトは Docker を使用して Next.js 開発環境を整備しています。

## 前提条件

- Docker Desktop がインストールされていること
- Docker Compose がインストールされていること

## クイックスタート

### 1. 環境変数の準備

プロジェクトのルートディレクトリに `.env.docker` ファイルが自動生成されています。
必要に応じて内容を編集してください。

### 2. Docker コンテナの起動

```bash
# ルートディレクトリから実行
docker-compose up -d

# または npm スクリプトで実行
cd next
npm run docker:up
```

### 3. アプリケーションにアクセス

ブラウザで `http://localhost:3000` にアクセスしてください。

### 4. データベースのマイグレーション

```bash
# コンテナ内で Prisma マイグレーションを実行
docker-compose exec app npx prisma migrate dev --name init

# または
npm run docker:shell
npx prisma migrate dev --name init
```

## よく使うコマンド

### アプリケーション関連

```bash
# コンテナの起動
npm run docker:up

# コンテナの停止
npm run docker:down

# ログ表示
npm run docker:logs

# コンテナ内のシェルにアクセス
npm run docker:shell

# コンテナのビルド
npm run docker:build
```

### データベース関連

```bash
# データベースログの表示
npm run docker:db:logs

# データベースへのアクセス
npm run docker:db:shell

# マイグレーション実行
docker-compose exec app npx prisma migrate dev

# マイグレーション状態確認
docker-compose exec app npx prisma migrate status
```

## ディレクトリ構造

```
NextTest/
├── next/                          # Next.js アプリケーション
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── docker/
│   ├── Dockerfile                # マルチステージビルド対応
│   ├── docker-compose.yml        # 本番・開発共通設定
│   └── .dockerignore             # Docker ビルド除外設定
├── docker-compose.override.yml   # 開発環境用オーバーライド
└── .env.docker                   # Docker 環境変数
```

## ファイル説明

### Dockerfile

マルチステージビルドを使用した最適化された Dockerfile です：

- **Builder ステージ**: 依存関係のインストール、Prisma Client 生成、アプリケーションビルド
- **Production ステージ**: 本番用の軽量イメージ、ヘルスチェック設定

### docker-compose.yml

本番環境と開発環境の両方に対応した設定：

- Next.js アプリケーションコンテナ
- PostgreSQL データベースコンテナ
- ネットワーク設定
- ボリューム管理
- ヘルスチェック設定

### docker-compose.override.yml

開発環境専用のオーバーライド設定：

- Builder ステージの使用（高速な開発ビルド）
- ホットリロード対応のボリュームマウント
- インタラクティブシェル対応（stdin_open, tty）

### .dockerignore

Docker ビルド時に除外するファイルを指定します。
ビルド時間を短縮し、イメージサイズを削減します。

### .env.local と .env.docker

- `.env.local`: 個別の開発環境設定（Git に含まれない）
- `.env.docker`: Docker コンテナ環境の共通設定

## トラブルシューティング

### ポート 3000 が既に使用されている

```bash
# 既存のコンテナを確認
docker ps

# 別のポートで起動
docker-compose up -d -e PORT=3001
```

### データベース接続エラー

```bash
# コンテナのステータス確認
docker-compose ps

# データベースログ確認
docker-compose logs db
```

### キャッシュのクリア

```bash
# イメージの削除と再ビルド
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## 本番環境へのデプロイ

本番環境では `docker-compose.override.yml` は使用されません。
`docker-compose.yml` の設定のみが適用されます。

```bash
# 本番用イメージのビルド
docker build -t nextapp:latest ./docker

# 本番環境での起動
docker run -p 3000:3000 -e DATABASE_URL="..." -e NODE_ENV="production" nextapp:latest
```
