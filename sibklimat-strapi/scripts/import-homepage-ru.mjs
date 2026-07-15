import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { compileStrapi, createStrapi } = require('@strapi/strapi')

const contentType = 'api::homepage.homepage'
const locale = 'ru-RU'
const force = process.argv.includes('--force')

const readStdin = async () => {
  process.stdin.setEncoding('utf8')
  let input = ''

  for await (const chunk of process.stdin) {
    input += chunk
  }

  if (input.trim().length === 0) {
    throw new Error('Expected Homepage JSON on stdin')
  }

  return JSON.parse(Buffer.from(input.trim(), 'base64').toString('utf8'))
}

const getMediaId = (value) => {
  const media = Array.isArray(value) ? value[0] : value

  if (typeof media === 'number') {
    return media
  }

  return media && typeof media.id === 'number' ? media.id : null
}

const preserveHeaderState = (data, existing) => {
  if (!data.header || !existing?.header) {
    return data
  }

  const header = { ...data.header }

  if (typeof existing.header.id === 'number') {
    header.id = existing.header.id
  }

  const logoId = getMediaId(existing.header.logo)
  if (logoId) {
    header.logo = logoId
  }

  const navigationIds = new Map(
    (existing.header.navigation ?? [])
      .filter((item) => typeof item?.id === 'number' && typeof item?.href === 'string')
      .map((item) => [item.href, item.id])
  )

  header.navigation = header.navigation.map((item) => {
    const id = navigationIds.get(item.href)
    return id ? { ...item, id } : item
  })

  return { ...data, header }
}

const main = async () => {
  const data = await readStdin()
  const appContext = await compileStrapi({ appDir: process.cwd() })
  const app = createStrapi({ ...appContext, serveAdminPanel: false })
  let importCompleted = false

  await app.load()

  try {
    const documents = app.documents(contentType)
    const existing = await documents.findFirst({
      locale,
      status: 'draft',
      populate: {
        header: {
          populate: {
            logo: true,
            navigation: true
          }
        }
      }
    })

    if (existing && !force) {
      throw new Error(
        `Homepage ${locale} already exists. Use --force only for an intentional overwrite.`
      )
    }

    const preparedData = preserveHeaderState(data, existing)
    const result = existing
      ? await documents.update({
          documentId: existing.documentId,
          locale,
          status: 'published',
          data: preparedData
        })
      : await documents.create({
          locale,
          status: 'published',
          data: preparedData
        })

    await new Promise((resolve) => process.stdout.write(
      `${JSON.stringify({
        documentId: result.documentId,
        locale: result.locale,
        publishedAt: result.publishedAt
      })}\n`,
      resolve
    ))

    importCompleted = true

    // Strapi 5.33 leaves a background admin-session query pending after a
    // programmatic load. The document transaction is already committed here;
    // exiting the one-shot container avoids a false `aborted` cleanup error.
    process.exit(0)
  } finally {
    try {
      await app.destroy()
    } catch (error) {
      if (!importCompleted) {
        throw error
      }

      console.warn(`Strapi cleanup warning: ${error.message}`)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
