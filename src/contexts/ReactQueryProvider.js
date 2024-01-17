"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function ReactQueryProvider({ children }) {
    const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 600000 } } }))
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}