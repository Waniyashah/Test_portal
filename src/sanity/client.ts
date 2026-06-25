import { createClient } from 'next-sanity'

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo123',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    useCdn: false, // set to false for dynamic data
    token: process.env.SANITY_API_TOKEN,
})
