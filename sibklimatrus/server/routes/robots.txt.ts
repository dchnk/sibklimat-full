export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const indexable = runtimeConfig.public.siteIndexable

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return indexable
    ? 'User-agent: *\nAllow: /\n'
    : 'User-agent: *\nDisallow: /\n'
})
