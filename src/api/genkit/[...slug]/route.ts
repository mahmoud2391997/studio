import { genkit } from 'genkit';
import { nextJsApiHandler } from '@genkit-ai/next';
import { googleAI } from '@genkit-ai/google-genai';

import '@/ai/flows/generate-exam-questions';
import '@/ai/flows/summarize-performance-feedback';

genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const POST = nextJsApiHandler();
