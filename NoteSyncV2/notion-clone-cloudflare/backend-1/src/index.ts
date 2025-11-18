import OpenAI from 'openai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
	OPEN_AI_KEY: string;
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'/*',
	cors({
		origin: '*', // Allow requests from your Next.js app
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'], // Add Content-Type to the allowed headers to fix CORS
		allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

// Health / root route to avoid 404 during local development
app.get('/', (c) => {
    return c.json({ status: 'ok', message: 'Worker is running' });
});

app.post('/chatToDocument', async (c) => {
	try {
		const { documentData, question } = await c.req.json();

		if (!question) {
			return c.json({ error: 'bad_request', message: 'Missing question' }, 400);
		}

		// Try OpenAI first
		try {
			const openai = new OpenAI({
				apiKey: c.env.OPEN_AI_KEY,
			});

			const chatCompletion = await openai.chat.completions.create({
				messages: [
					{
						role: 'system',
						content:
							'You are an assistant helping the user to chat with a document. You are given a JSON string of the document content. Use it to answer concisely and accurately.',
					},
					{
						role: 'user',
						content:
							'Document content (JSON or text): ' +
							String(documentData) +
							'\n\nQuestion: ' +
							String(question),
					},
				],
				model: 'gpt-4o',
				temperature: 0.3,
			});

			const response = chatCompletion.choices[0]?.message?.content ?? '';
			return c.json({ message: response ?? '' });
		} catch (err: any) {
			// If OpenAI rate limits or quota issues, gracefully fallback to Workers AI
			const status = err?.status ?? err?.code ?? 500;
			const isQuota = status === 429 || err?.code === 'insufficient_quota';
			if (!isQuota) {
				// Non-quota error: return a structured error without 500 HTML
				return c.json(
					{
						error: 'upstream_openai_error',
						message:
							err?.message ||
							'Upstream OpenAI error. Please try again later.',
					},
					typeof status === 'number' ? status : 502
				);
			}

			// Fallback to Cloudflare Workers AI (instruct model)
			try {
				const prompt =
					'You are an assistant helping the user to chat with a document.\n' +
					'Use the provided document content to answer the question concisely.\n\n' +
					'Document content:\n' +
					String(documentData) +
					'\n\nQuestion:\n' +
					String(question);

				const aiResult = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
					prompt,
					max_tokens: 400,
					temperature: 0.3,
				});

				// Workers AI returns { response: string } for instruct models
				const fallbackMessage =
					(aiResult as any)?.response ||
					(aiResult as any)?.result ||
					JSON.stringify(aiResult);
				return c.json({
					message: fallbackMessage,
					note: 'Returned via Workers AI fallback due to OpenAI quota.',
				});
			} catch (fallbackErr: any) {
				return c.json(
					{
						error: 'fallback_error',
						message:
							fallbackErr?.message ||
							'Both OpenAI and Workers AI failed. Please try again later.',
					},
					502
				);
			}
		}
	} catch (outerErr: any) {
		return c.json(
			{
				error: 'server_error',
				message:
					outerErr?.message ||
					'Unexpected server error while processing the request.',
			},
			500
		);
	}
});

app.post('/translateDocument', async (c) => {
	const { documentData, targetLang } = await c.req.json();

	// generate a summary of the document
	const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	});

	// translate the summary to another language
	const response = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryResponse.summary,
		source_lang: 'english', // defaults to english
		target_lang: targetLang,
	});

	return new Response(JSON.stringify(response));
});

export default app;