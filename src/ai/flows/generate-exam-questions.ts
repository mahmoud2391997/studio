'use server';

/**
 * @fileOverview An AI agent for generating bar exam questions on a specific legal topic.
 *
 * - generateExamQuestions - A function that generates a set of bar exam questions on a given legal topic.
 * - GenerateExamQuestionsInput - The input type for the generateExamQuestions function.
 * - GenerateExamQuestionsOutput - The return type for the generateExamQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExamQuestionsInputSchema = z.object({
  legalTopic: z.string().describe('The specific legal topic to generate questions for.'),
  numberOfQuestions: z
    .number()
    .default(5)
    .describe('The number of exam questions to generate.'),
});
export type GenerateExamQuestionsInput = z.infer<typeof GenerateExamQuestionsInputSchema>;

const GenerateExamQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated bar exam questions.'),
});
export type GenerateExamQuestionsOutput = z.infer<typeof GenerateExamQuestionsOutputSchema>;

export async function generateExamQuestions(input: GenerateExamQuestionsInput): Promise<GenerateExamQuestionsOutput> {
  return generateExamQuestionsFlow(input);
}

const generateExamQuestionsPrompt = ai.definePrompt({
  name: 'generateExamQuestionsPrompt',
  input: {schema: GenerateExamQuestionsInputSchema},
  output: {schema: GenerateExamQuestionsOutputSchema},
  prompt: `You are an expert in creating bar exam questions. Generate {{{numberOfQuestions}}} multiple choice bar exam questions on the topic of {{{legalTopic}}}. The questions should test the knowledge of lawyer trainees preparing for the bar exam. Only return the questions in a JSON array.`,
});

const generateExamQuestionsFlow = ai.defineFlow(
  {
    name: 'generateExamQuestionsFlow',
    inputSchema: GenerateExamQuestionsInputSchema,
    outputSchema: GenerateExamQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateExamQuestionsPrompt(input);
    return output!;
  }
);
