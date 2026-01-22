# NextTest
NextTest


# ルートディレクトリから実行
cd NextTest
npm run docker:up

# データベースマイグレーション
npm run docker:shell
npx prisma migrate dev --name init

# ブラウザで http://localhost:3000 にアクセス