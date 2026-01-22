# Docker セットアップガイド

このプロジェクトは Docker を使用して Next.js 開発環境を整備しています。

## 前提条件

- Docker Desktop がインストールされていること
- Docker Compose がインストールされていること

## クイックスタート

### 1. Docker コンテナの起動

```bash
# docker フォルダから実行
cd docker
docker-compose up -d

# または、next フォルダの npm スクリプトで実行
cd next
npm run docker:up
```

### 2. アプリケーションにアクセス

ブラウザで `http://localhost:3000` にアクセスしてください。

### 3. データベースのマイグレーション

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

```text
NextTest/
├── docker/
│   ├── Dockerfile                # マルチステージビルド対応
│   ├── docker-compose.yml        # 本番・開発共通設定
│   └── .dockerignore             # Docker ビルド除外設定
│
├── next/                          # Next.js アプリケーション
│   ├── src/
│   ├── public/
│   ├── package.json              # docker スクリプト
│   ├── .env.local                # ローカル環境設定
│   ├── tsconfig.json
│   └── ...
│
├── .gitignore                    # ルートレベル除外設定
├── README.md                     # プロジェクト概要
└── DOCKER_SETUP.md               # このファイル
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
- インタラクティブシェル対応（stdin_open, tty）

### .dockerignore

Docker ビルド時に除外するファイルを指定します。
ビルド時間を短縮し、イメージサイズを削減します。

### .env.local

ローカル開発環境の設定ファイルです（Git に含まれません）

## トラブルシューティング

### データベースが unhealthy 状態になる

```bash
# 既存のコンテナとボリュームを完全に削除
cd docker
docker-compose down -v

# 再起動
docker-compose up -d

# データベースログを確認
docker-compose logs -f db
```

### ポート 3000 が既に使用されている

```bash
# 既存のコンテナを確認
docker ps

# 別のポートで起動する場合は docker-compose.yml を編集
```

### データベース接続エラー

```bash
# コンテナのステータス確認
docker-compose ps

# データベースログ確認
docker-compose logs db

# データベースに直接接続して確認
docker-compose exec db psql -U postgres -d nextapp
```

### 孤立したコンテナ（orphan containers）の警告

```bash
# 孤立したコンテナを削除
docker-compose down --remove-orphans

# 再起動
docker-compose up -d
```

### キャッシュのクリア

```bash
# イメージの削除と再ビルド
docker-compose down -v
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
