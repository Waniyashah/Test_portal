import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
    name: 'default',
    title: 'MCQ Test SaaS',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    basePath: '/studio', // Moved to /studio so /admin remains your custom dashboard

    plugins: [structureTool()],

    schema: {
        types: schemaTypes.types,
    },
})
