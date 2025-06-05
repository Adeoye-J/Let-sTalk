import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export const QueryProvider = ({children} : {children: React.ReactNode}) => {
    
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
            mutations: {
                retry: 1,
            },
        },
    })
    
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
