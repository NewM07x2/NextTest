'use client'

import { UrqlProvider } from '@urql/next'
import { urqlClient } from '../lib/graphql/urqlClient'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UrqlProvider client={urqlClient}>
      {children}
    </UrqlProvider>
  )
}
