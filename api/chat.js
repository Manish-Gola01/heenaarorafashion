const instructions = `You are the couture styling assistant for Heena Arora, a contemporary Indian fashion house. Help customers choose outfits, fabrics, colours, and accessories for their occasion, budget, and preferences. Be warm, specific, concise, and practical. Ask one brief follow-up question when important details are missing. Do not claim an item is in stock or invent product prices. Reply in plain text, with short paragraphs or a few bullets when useful.`

async function getRequestBody(request) {
    if (request.body && typeof request.body === 'object') return request.body

    let rawBody = ''
    for await (const chunk of request) {
        rawBody += chunk
        if (rawBody.length > 10000) throw new Error('Request body is too large.')
    }
    return JSON.parse(rawBody || '{}')
}

function sendJson(response, status, body) {
    response.statusCode = status
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(body))
}

export default async function chat(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST')
        return sendJson(response, 405, { error: 'Use POST to send a message.' })
    }

    let body
    try {
        body = await getRequestBody(request)
    } catch {
        return sendJson(response, 400, { error: 'Send a valid JSON message.' })
    }

    const message = typeof body.message === 'string' ? body.message.trim() : ''
    if (!message || message.length > 2000) {
        return sendJson(response, 400, { error: 'Enter a message of 1 to 2000 characters.' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return sendJson(response, 503, { error: 'The assistant is not configured yet. Add GEMINI_API_KEY to the server environment.' })
    }

    const model = process.env.GEMINI_MODEL || 'gemini-flash-latest'
    try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: instructions }] },
                contents: [{ role: 'user', parts: [{ text: message }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
            }),
        })

        if (!geminiResponse.ok) {
            return sendJson(response, 502, { error: 'Gemini could not respond. Check the API key and try again.' })
        }

        const result = await geminiResponse.json()
        const reply = result.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || '')
            .join('')
            .trim()

        if (!reply) return sendJson(response, 502, { error: 'Gemini returned an empty response. Please try again.' })
        return sendJson(response, 200, { reply })
    } catch {
        return sendJson(response, 502, { error: 'Could not reach Gemini. Check your connection and try again.' })
    }
}