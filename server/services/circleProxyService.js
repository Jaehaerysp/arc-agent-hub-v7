import logger from '../middleware/logger.js'
import { getCircleConfig } from '../config/circle.js'

// Headers that must never be forwarded as-is between hops (either
// hop-by-hop per the HTTP spec, or origin-identifying values that would
// otherwise leak this server's internals or fail upstream validation).
const STRIPPED_REQUEST_HEADERS = new Set([
  'host',
  'origin',
  'referer',
  'connection',
  'content-length',
  'cookie',
  'authorization', // Replaced with the server-side Kit Key
])

const STRIPPED_RESPONSE_HEADERS = new Set([
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'connection',
  'access-control-allow-origin',
  'access-control-allow-headers',
  'access-control-allow-methods',
])

function assertProxyablePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    const err = new Error('Invalid proxy path')
    err.isValidationError = true
    throw err
  }
}

function buildForwardHeaders(originalHeaders, kitKey) {
  const headers = new Headers()

  for (const [key, value] of Object.entries(originalHeaders || {})) {
    if (STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) continue
    headers.set(key, value)
  }

  // Current implementation assumes Bearer authentication.
  // If Circle's API expects a different authentication mechanism,
  // the responseBody logged below should reveal it.
  headers.set('Authorization', `Bearer ${kitKey}`)

  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  return headers
}

export async function forwardToCircle({ path, method, headers, body }) {
  assertProxyablePath(path)

  const { kitKey, swapApiHost } = getCircleConfig()

  const url = `${swapApiHost}${path}`
  const forwardHeaders = buildForwardHeaders(headers, kitKey)

  logger.info('Forwarding request to Circle', {
    url,
    method: method || 'GET',
    headers: Object.fromEntries(forwardHeaders.entries()),
    body,
  })

  let upstreamResponse

  try {
    upstreamResponse = await fetch(url, {
      method: method || 'GET',
      headers: forwardHeaders,
      body:
        body && method !== 'GET' && method !== 'HEAD'
          ? JSON.stringify(body)
          : undefined,
    })
  } catch (error) {
    logger.error('Failed to reach Circle API', {
      url,
      message: error.message,
      stack: error.stack,
    })

    throw error
  }

  const responseBody = await upstreamResponse.text()

  logger.info('Proxied Circle Stablecoin Kit request', {
    path,
    method: method || 'GET',
    upstreamStatus: upstreamResponse.status,
  })

  if (!upstreamResponse.ok) {
    logger.error('Circle API error', {
      status: upstreamResponse.status,
      path,
      method: method || 'GET',
      requestUrl: url,
      responseHeaders: Object.fromEntries(upstreamResponse.headers.entries()),
      responseBody,
    })

    const err = new Error('Circle Stablecoin Kit API returned an error')
    err.upstreamStatus = upstreamResponse.status
    err.responseBody = responseBody
    throw err
  }

  const responseHeaders = {}

  upstreamResponse.headers.forEach((value, key) => {
    if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders[key] = value
    }
  })

  return {
    status: upstreamResponse.status,
    headers: responseHeaders,
    body: responseBody,
  }
}

export default forwardToCircle