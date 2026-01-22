'use client'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">NextTest</h1>
      <p className="text-gray-600 mb-8">Docker環境でのNext.js開発環境です</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">環境情報</h2>
          <ul className="text-sm text-gray-700">
            <li>Next.js: 14.1.0</li>
            <li>Node.js: 20-alpine</li>
            <li>PostgreSQL: 16-alpine</li>
            <li>Prisma ORM</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded-lg bg-green-50">
          <h2 className="text-xl font-semibold mb-2">Available Routes</h2>
          <ul className="text-sm text-gray-700">
            <li><a href="/graphql" className="text-blue-600 hover:underline">/graphql</a> - GraphQL Example</li>
            <li><a href="/graphql/get-api" className="text-blue-600 hover:underline">/graphql/get-api</a> - API Example</li>
            <li><a href="/graphql/ssr-example" className="text-blue-600 hover:underline">/graphql/ssr-example</a> - SSR Example</li>
          </ul>
        </div>
      </div>
    </div>
  );
}