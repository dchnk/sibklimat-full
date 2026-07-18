const noIndexPolicy = 'noindex, nofollow, noarchive, nosnippet, noimageindex'

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)

  if (!runtimeConfig.public.siteIndexable) {
    setResponseHeader(event, 'X-Robots-Tag', noIndexPolicy)
  }
})
