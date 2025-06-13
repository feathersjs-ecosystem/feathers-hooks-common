import fs from 'node:fs/promises'
import matter from 'gray-matter'
import { glob } from 'glob'
import kebabCase from 'lodash/kebabCase.js'
import { mainBranch, repository } from './meta'

export type Utility = {
  name: string
  title: string
  description: string
  category: 'hooks' | 'utils' | 'resolvers' | 'predicates'
  slug: string
  path: string
  pathMd: string
  frontmatter: Record<string, any>
  content: string
  lastModified: Date
  sourceUrl: string
  hook?: Record<string, any>
}

const utilities = new Map<string, Utility>()
let utilitiesList: Utility[] = []

export async function discoverUtilities() {
  const { srcDir = 'src', pattern = '**/*.md', exclude = ['**/node_modules/**', '**/dist/**'] } = {}

  const markdownFiles = await glob(`${srcDir}/${pattern}`, { ignore: exclude })
  utilities.clear()
  utilitiesList = []

  for (const filePath of markdownFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const { data: frontmatter, content: body } = matter(content)

      const { title = '', description = '', category, hook } = frontmatter

      if (!title || ['hooks', 'utils', 'resolvers', 'predicates'].indexOf(category) === -1) {
        console.warn(
          `Skipping ${filePath}: Missing title or invalid category`,
          title,
          category,
          frontmatter,
        )
        continue
      }

      const slug = kebabCase(title)

      console.log(`Processing ${filePath} -> ${slug}`)

      const utility: Utility = {
        name: title,
        title,
        description,
        category,
        slug,
        path: `/${category}/${slug}`,
        pathMd: `/${category}/${slug}.md`,
        frontmatter,
        content: body,
        hook,
        lastModified: (await fs.stat(filePath)).mtime,
        sourceUrl: `https://github.com/${repository}/blob/${mainBranch}/src/${category}/${slug}/${slug}.ts`,
      }

      utilities.set(slug, utility)
      utilitiesList.push(utility)
    } catch (error) {
      console.warn(`Failed to process ${filePath}:`, error.message)
    }
  }

  utilitiesList.sort((a, b) => a.title.localeCompare(b.title))

  return utilitiesList
}
