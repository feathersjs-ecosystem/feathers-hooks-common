import type { Utility } from '../utilities'
import dedent from 'dedent'

const arr = (value: any[]) => {
  if (!value || !value.length) return '[]'
  const val = value
    .map(x => {
      if (typeof x === 'string') return `'${x}'`
      if (typeof x === 'number') return x.toString()
      return JSON.stringify(x)
    })
    .join(', ')

  return `[${val}]`
}

export default (utility: Utility) => {
  const code = [
    dedent`# ${utility.title}

    [Source Code](${utility.sourceUrl})

    ${utility.description}

    \`\`\`ts twoslash
      import { ${utility.name} } from 'feathers-commons/${utility.category}';
    \`\`\` `,
  ]

  if (utility.hook) {
    code.push(dedent`
      <HookTable :type="${arr(utility.hook.type)}" :method="${arr(utility.hook.method)}" :multi="${utility.hook.multi}" source="https://github.com/feathersjs-ecosystem/feathers-hooks-common/blob/master/src/hooks/required.ts" />
    `)
  }

  code.push(utility.content)

  return code.join('\n\n')
}
