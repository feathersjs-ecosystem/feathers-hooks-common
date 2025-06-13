import { defineConfig } from 'vitepress'
import { name, description, ogUrl, ogImage, repository, mainBranch } from './meta'
import { version } from '../../package.json'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { discoverUtilities } from './utilities'
import { MarkdownTransform } from './plugins/markdownTransform'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import tailwindcss from '@tailwindcss/vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const utilities = await discoverUtilities()

export default defineConfig({
  title: name,
  lastUpdated: true,
  description: '',
  head: [
    ['meta', { name: 'theme-color', content: '#ae0bb1' }],
    ['link', { rel: 'icon', href: '/feathers-hooks-common-logo.png' }],
    ['meta', { property: 'og:title', content: name }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:title', content: name }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  themeConfig: {
    siteTitle: name,
    editLink: {
      pattern: `https://github.com/${repository}/edit/${mainBranch}/docs/:path`,
    },
    lastUpdatedText: 'Last Updated',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/qa8kez8QBx',
      },
      {
        icon: 'github',
        link: `https://github.com/${repository}`,
      },
    ],
    logo: '/feathers-hooks-common-logo.png',
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Overview', link: '/overview' },
          {
            text: 'Hooks',
            link: '/hooks',
            items: utilities
              .filter(x => x.category === 'hooks')
              .map(x => ({
                text: x.title,
                link: x.path,
              })),
          },
          {
            text: 'Utilities',
            link: '/utils',
            items: utilities
              .filter(x => x.category === 'utils')
              .map(x => ({
                text: x.title,
                link: x.path,
              })),
          },
          {
            text: 'Predicates',
            link: '/predicates',
            items: utilities
              .filter(x => x.category === 'predicates')
              .map(x => ({
                text: x.title,
                link: x.path,
              })),
          },
          { text: 'Migrating', link: '/migrating' },
          { text: 'Guides', link: '/guides' },
        ],
      },
    ],
    nav: [
      {
        text: `v${version}`,
        items: [
          {
            text: 'Changelog',
            link: `https://github.com/${repository}/blob/${mainBranch}/CHANGELOG.md`,
          },
          {
            text: 'Contributing',
            link: `https://github.com/${repository}/blob/${mainBranch}/.github/contributing.md`,
          },
        ],
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2016-present Feathers contributors',
    },
    algolia: {
      appId: '4GNLWKU0RF',
      apiKey: '8114a3bec3c82b65c26a4ed113659bce',
      indexName: 'feathers-hooks',
    },
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          compilerOptions: {
            paths: {
              'feathers-commons': [resolve(__dirname, '../../src/index.ts')],
              'feathers-commons/hooks': [resolve(__dirname, '../../src/hooks/index.ts')],
              'feathers-commons/utils': [resolve(__dirname, '../../src/utils/index.ts')],
              'feathers-commons/predicates': [resolve(__dirname, '../../src/predicates/index.ts')],
              'feathers-commons/resolvers': [resolve(__dirname, '../../src/resolvers/index.ts')],
            },
          },
        },
      }),
    ],
    // Explicitly load these languages for types hightlighting
    languages: ['js', 'ts'],
  },
  vite: {
    server: {
      fs: {
        allow: [resolve(__dirname, '../../src')],
      },
    },
    plugins: [
      MarkdownTransform({
        vitepressDirectory: resolve(__dirname, '../'),
      }),
      tailwindcss(),
    ],
  },
})
