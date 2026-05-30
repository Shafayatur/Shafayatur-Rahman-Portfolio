import handler from '../dist/server/server.js'

export default async function (req, res) {
    const url = new URL(req.url, `https://${req.headers.host}`)

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
        if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value)
    }

    let body = undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        body = await new Promise((resolve) => {
            const chunks = []
            req.on('data', (chunk) => chunks.push(chunk))
            req.on('end', () => resolve(Buffer.concat(chunks)))
        })
    }

    const request = new Request(url.toString(), {
        method: req.method,
        headers,
        body: body?.length ? body : undefined,
    })

    const response = await handler.fetch(request)

    res.statusCode = response.status
    response.headers.forEach((value, key) => {
        res.setHeader(key, value)
    })

    const buffer = await response.arrayBuffer()
    res.end(Buffer.from(buffer))
}