import fs from 'node:fs/promises'
import path from 'node:path'

const PROJECT_ROOT = process.cwd()

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token) continue
    if (token.startsWith('--')) {
      const [key, maybeValue] = token.split('=')
      if (maybeValue !== undefined) {
        args[key] = maybeValue
      } else {
        const next = argv[i + 1]
        if (next && !next.startsWith('--')) {
          args[key] = next
          i += 1
        } else {
          args[key] = true
        }
      }
    } else {
      args._.push(token)
    }
  }
  return args
}

function normalizeCategory(input) {
  const raw = String(input ?? '').trim()
  if (!raw) return null
  const lower = raw.toLowerCase()
  if (lower === 'animations' || lower === 'animation') return 'Animations'
  if (lower === 'components' || lower === 'component') return 'Components'
  return raw[0]?.toUpperCase() + raw.slice(1)
}

function toSlug(displayName) {
  return String(displayName)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-')
}

function toPascal(displayName) {
  const cleaned = String(displayName)
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
  if (!cleaned) return ''
  return cleaned
    .split(/\s+/g)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('')
}

function toCamelFromPascal(pascal) {
  if (!pascal) return ''
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

async function fileExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function writeFileSafe(filePath, content, { force = false } = {}) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  if (!force && (await fileExists(filePath))) return { written: false }
  await fs.writeFile(filePath, content, 'utf8')
  return { written: true }
}

function ensureTrailingNewline(s) {
  return s.endsWith('\n') ? s : `${s}\n`
}

function insertIntoArrayLiteral(source, exportName, value) {
  // export const NEW = ["Flow Border"];
  // export const NEW = ['Flow Border']
  // semicolon optional
  const re = new RegExp(
    `export\\s+const\\s+${exportName}\\s*=\\s*\\[(?<items>[\\s\\S]*?)\\]\\s*;?`,
    'm',
  )
  const match = source.match(re)
  if (!match?.groups) return { updated: source, changed: false }
  const existingItems = match.groups.items
  if (existingItems.includes(`"${value}"`) || existingItems.includes(`'${value}'`)) {
    return { updated: source, changed: false }
  }

  const before = match[0]
  const items = existingItems.trim().replace(/\s+/g, ' ')
  const nextItems = items ? `${items.replace(/,\s*$/m, '')}, "${value}"` : `"${value}"`
  const after = `export const ${exportName} = [${nextItems}];`
  return { updated: source.replace(before, after), changed: true }
}

function insertSubcategoryIntoCategoriesTs(source, categoryName, displayName) {
  // Find the category block by name: "Animations" or "Components"
  const blockRe = new RegExp(
    [
      `\\{`,
      `[\\s\\S]*?`,
      `name:\\s*["']${categoryName}["']\\s*,`,
      `[\\s\\S]*?`,
      `subcategories:\\s*\\[(?<subs>[\\s\\S]*?)\\]`,
      `[\\s\\S]*?`,
      `\\}`,
    ].join(''),
    'm',
  )
  const match = source.match(blockRe)
  if (!match?.groups) return { updated: source, changed: false }

  const existingBlock = match[0]
  const subsRaw = match.groups.subs
  if (subsRaw.includes(`"${displayName}"`)) return { updated: source, changed: false }
  if (subsRaw.includes(`'${displayName}'`)) return { updated: source, changed: false }
  const subsTrim = subsRaw.trim()
  const normalized = subsTrim.replace(/\s+/g, ' ')
  const insertion = normalized
    ? `${normalized.replace(/,\s*$/m, '')}, "${displayName}"`
    : `"${displayName}"`
  const nextBlock = existingBlock.replace(subsRaw, insertion)
  return { updated: source.replace(existingBlock, nextBlock), changed: true }
}

function insertMapEntryIntoComponentsTs(source, mapName, slug, demoImportPath) {
  const objRe = new RegExp(`const\\s+${mapName}\\s*=\\s*\\{(?<body>[\\s\\S]*?)\\n\\};`, 'm')
  const match = source.match(objRe)
  if (!match?.groups) return { updated: source, changed: false }
  if (source.includes(`"${slug}":`)) return { updated: source, changed: false }

  const body = match.groups.body
  const insertionLine = `  "${slug}": () => import("${demoImportPath}"),`
  const nextBody = body.replace(/\s*$/, (end) => `${end}\n${insertionLine}`)

  const nextObj = match[0].replace(body, nextBody)
  return { updated: source.replace(match[0], nextObj), changed: true }
}

function contentVueTemplate({ className, displayName }) {
  return ensureTrailingNewline(`<template>
  <div class="${className}">
    <div class="text-white/80 text-sm">${displayName}</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.${className} {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
</style>
`)
}

function codeTsTemplate({ category, pascalName, exportVar, relativePath }) {
  return ensureTrailingNewline(`import code from "@/content/${relativePath}?raw";
import { createCodeObject } from "../../../types/code";

export const ${exportVar} = createCodeObject(code, "${category}/${pascalName}", {
  installation: \`\`,
  usage: \`
<template>
  <${pascalName} />
</template>

<script setup lang="ts">
import ${pascalName} from "./${pascalName}.vue";
</script>
\`,
});
`)
}

function demoVueTemplate({ pascalName, exportVar, contentImportPath, codeImportPath }) {
  return ensureTrailingNewline(`<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <${pascalName} />
      </div>

      <Customize />

      <PropTable :data="propData" />
      <Dependencies :dependency-list="[]" />
    </template>
    <template #code>
      <CodeExample :code-object="${exportVar}" />
    </template>
    <template #cli>
      <CliInstallation :command="${exportVar}.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import TabbedLayout from "@/components/common/TabbedLayout.vue";
import CodeExample from "@/components/code/CodeExample.vue";
import PropTable from "@/components/common/PropTable.vue";
import Dependencies from "@/components/code/DependenciesCode.vue";
import Customize from "@/components/common/Customize.vue";
import CliInstallation from "@/components/code/CliInstallation.vue";

import ${pascalName} from "${contentImportPath}";
import { ${exportVar} } from "${codeImportPath}";

const propData = [
  {
    name: "className",
    type: "string",
    default: "",
    description: "Custom class name(s) applied to the container element.",
  },
];
</script>
`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const category = normalizeCategory(args['--category'] ?? args['-c'])
  const displayName = String(args['--name'] ?? args['-n'] ?? args._[0] ?? '').trim()
  const force = Boolean(args['--force'])
  const markNew = Boolean(args['--new'])
  const markUpdated = Boolean(args['--updated'])

  if (!category || (category !== 'Animations' && category !== 'Components')) {
    console.error(`Missing/invalid --category. Use "Animations" or "Components".`)
    process.exit(1)
  }
  if (!displayName) {
    console.error(`Missing --name. Example: --name "Metallic Paint"`)
    process.exit(1)
  }

  const slug = toSlug(displayName)
  const pascalName = toPascal(displayName)
  if (!slug || !pascalName) {
    console.error(`Invalid name. Got slug="${slug}" pascal="${pascalName}".`)
    process.exit(1)
  }
  const exportVar = toCamelFromPascal(pascalName)

  const contentDir = path.join(PROJECT_ROOT, 'src', 'content', category, pascalName)
  const contentFile = path.join(contentDir, `${pascalName}.vue`)
  const demoDir = path.join(PROJECT_ROOT, 'src', 'demo', category)
  const demoFile = path.join(demoDir, `${pascalName}Demo.vue`)
  const codeDir = path.join(PROJECT_ROOT, 'src', 'constants', 'code', category)
  const codeFile = path.join(codeDir, `${pascalName}Code.ts`)

  const relativeContentImport = `@/content/${category}/${pascalName}/${pascalName}.vue`
  const relativeCodeImport = `@/constants/code/${category}/${pascalName}Code`
  const relativeContentRaw = `${category}/${pascalName}/${pascalName}.vue`

  const className = `${slug}-container`

  const writes = []
  writes.push(
    writeFileSafe(contentFile, contentVueTemplate({ className, displayName }), { force }).then(
      (r) => ({
        file: contentFile,
        ...r,
      }),
    ),
  )
  writes.push(
    writeFileSafe(
      codeFile,
      codeTsTemplate({ category, pascalName, exportVar, relativePath: relativeContentRaw }),
      { force },
    ).then((r) => ({ file: codeFile, ...r })),
  )
  writes.push(
    writeFileSafe(
      demoFile,
      demoVueTemplate({
        category,
        pascalName,
        exportVar,
        contentImportPath: relativeContentImport,
        codeImportPath: relativeCodeImport,
        displayName,
      }),
      { force },
    ).then((r) => ({ file: demoFile, ...r })),
  )

  const results = await Promise.all(writes)

  const categoriesPath = path.join(PROJECT_ROOT, 'src', 'constants', 'Categories.ts')
  const componentsMapPath = path.join(PROJECT_ROOT, 'src', 'constants', 'Components.ts')

  let categoriesSource = await fs.readFile(categoriesPath, 'utf8')
  let componentsSource = await fs.readFile(componentsMapPath, 'utf8')

  let changedCategories = false
  let changedComponents = false

  {
    const { updated, changed } = insertSubcategoryIntoCategoriesTs(
      categoriesSource,
      category,
      displayName,
    )
    categoriesSource = updated
    changedCategories ||= changed
  }

  if (markNew) {
    const { updated, changed } = insertIntoArrayLiteral(categoriesSource, 'NEW', displayName)
    categoriesSource = updated
    changedCategories ||= changed
  }
  if (markUpdated) {
    const { updated, changed } = insertIntoArrayLiteral(categoriesSource, 'UPDATED', displayName)
    categoriesSource = updated
    changedCategories ||= changed
  }

  {
    const mapName = category === 'Animations' ? 'animations' : 'components'
    const demoImportPath = `../demo/${category}/${pascalName}Demo.vue`
    const { updated, changed } = insertMapEntryIntoComponentsTs(
      componentsSource,
      mapName,
      slug,
      demoImportPath,
    )
    componentsSource = updated
    changedComponents ||= changed
  }

  if (changedCategories)
    await fs.writeFile(categoriesPath, ensureTrailingNewline(categoriesSource), 'utf8')
  if (changedComponents)
    await fs.writeFile(componentsMapPath, ensureTrailingNewline(componentsSource), 'utf8')

  const writtenFiles = results.filter((r) => r.written).map((r) => r.file)
  const skippedFiles = results.filter((r) => !r.written).map((r) => r.file)

  console.log(`Created entry: ${displayName}`)
  console.log(`- category: ${category}`)
  console.log(`- slug: ${slug}`)
  console.log(`- component: ${pascalName}`)
  if (writtenFiles.length) {
    console.log(`Written files:`)
    for (const f of writtenFiles) console.log(`- ${path.relative(PROJECT_ROOT, f)}`)
  }
  if (skippedFiles.length) {
    console.log(`Skipped existing files (use --force to overwrite):`)
    for (const f of skippedFiles) console.log(`- ${path.relative(PROJECT_ROOT, f)}`)
  }
  if (changedCategories) console.log(`Updated: src/constants/Categories.ts`)
  if (changedComponents) console.log(`Updated: src/constants/Components.ts`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
