# NextTest

NextTest プロジェクトです。

## Docker を使った開発環境の起動

詳細は [DOCKER_SETUP.md](./DOCKER_SETUP.md) を参照してください。

### クイックスタート

```bash
# docker フォルダから実行
cd docker
docker-compose up -d

# または next フォルダから npm スクリプトで実行
cd next
npm run docker:up
```

### データベースマイグレーション

```bash
npm run docker:shell
npx prisma migrate dev --name init
```

ブラウザで `http://localhost:3000` にアクセスしてください。
