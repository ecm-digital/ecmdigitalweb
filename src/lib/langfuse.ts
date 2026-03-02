import Langfuse from 'langfuse';

let _client: Langfuse | null = null;

export function getLangfuse(): Langfuse | null {
    if (typeof window === 'undefined') return null;

    const publicKey = process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL || 'https://cloud.langfuse.com';

    if (!publicKey) return null;

    if (!_client) {
        _client = new Langfuse({
            publicKey,
            baseUrl,
            flushAt: 1, // Send immediately (good for browser)
            flushInterval: 0,
        });
    }
    return _client;
}

/**
 * Trace a Gemini AI call with Langfuse
 */
export async function traceAICall({
    name,
    input,
    output,
    model = 'gemini-2.5-flash',
    userId,
    metadata,
}: {
    name: string;
    input: string;
    output: string;
    model?: string;
    userId?: string;
    metadata?: Record<string, any>;
}): Promise<void> {
    try {
        const lf = getLangfuse();
        if (!lf) return;

        const trace = lf.trace({
            name,
            userId: userId || 'anonymous',
            metadata,
        });

        trace.generation({
            name,
            model,
            input,
            output,
            metadata,
        });

        await lf.flushAsync();
    } catch (err) {
        // Langfuse errors should never break the app
        console.warn('[Langfuse] Trace error:', err);
    }
}
