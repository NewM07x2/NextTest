# Docker ファイル統合完了

Docker 関連ファイルの整理が完了しました。

## 📁 変更内容

すべての Docker 関連ファイルが `docker` フォルダに統合されました。

### 移動されたファイル

- `.env.docker` → `docker/.env.docker`
- `docker-compose.override.yml` → `docker/docker-compose.override.yml`

### クリーンアップ（手動で実行してください）

ルートディレクトリに残っている古いファイルを削除してください：

```bash
# Windows PowerShell の場合
Remove-Item -Path .\.env.docker -Force
Remove-Item -Path .\docker-compose.override.yml -Force

# Linux/Mac の場合
rm .env.docker
rm docker-compose.override.yml
```

## ✅ 最終的なディレクトリ構造

```text
NextTest/
├── .gitignore
├── README.md
├── DOCKER_SETUP.md
├── CHANGES_SUMMARY.md
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.override.yml  # ← 統合済み
│   ├── .env.docker                  # ← 統合済み
│   └── .dockerignore
│
└── next/
    ├── .env.local
    ├── package.json
    └── ...
```

## 🚀 使用方法

### 方法 1: docker フォルダから直接実行

```bash
cd docker
docker-compose up -d
```

### 方法 2: next フォルダから npm スクリプトで実行

```bash
cd next
npm run docker:up
```

## 📝 関連ドキュメント

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - 詳細なセットアップガイド
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - 変更内容の詳細説明
- [README.md](./README.md) - プロジェクト概要
