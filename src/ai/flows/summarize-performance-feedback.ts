'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing a trainee's performance on practice exams.
 *
 * - summarizePerformanceFeedback - A function that takes performance data and returns an AI-powered summary.
 * - SummarizePerformanceFeedbackInput - The input type for the summarizePerformanceFeedback function.
 * - SummarizePerformanceFeedbackOutput - The return type for the summarizePerformanceFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePerformanceFeedbackInputSchema = z.object({
  examName: z.string().describe('The name of the exam taken.'),
  strengths: z.string().describe('A summary of the trainee\'s strengths.'),
  weaknesses: z.string().describe('A summary of the trainee\'s weaknesses.'),
  overallScore: z.number().describe('The trainee\'s overall score on the exam.'),
});
export type SummarizePerformanceFeedbackInput = z.infer<
  typeof SummarizePerformanceFeedbackInputSchema
>;

const SummarizePerformanceFeedbackOutputSchema = z.object({
  summary: z.string().describe('A detailed summary of the trainee\'s performance, highlighting strengths and weaknesses, and providing actionable advice.'),
});
export type SummarizePerformanceFeedbackOutput = z.infer<
  typeof SummarizePerformanceFeedbackOutputSchema
>;

export async function summarizePerformanceFeedback(
  input: SummarizePerformanceFeedbackInput
): Promise<SummarizePerformanceFeedbackOutput> {
  return summarizePerformanceFeedbackFlow(input);
}

const summarizePerformanceFeedbackPrompt = ai.definePrompt({
  name: 'summarizePerformanceFeedbackPrompt',
  input: {schema: SummarizePerformanceFeedbackInputSchema},
  output: {schema: SummarizePerformanceFeedbackOutputSchema},
  prompt: `You are an AI-powered tutor, providing feedback to law school trainees on their bar exam simulation performance.

  Based on the following performance data, provide a detailed summary of the trainee's performance. The summary should highlight strengths and weaknesses, and offer specific, actionable advice for improvement.

  Exam Name: {{{examName}}}
  Overall Score: {{{overallScore}}}
  Strengths: {{{strengths}}}
  Weaknesses: {{{weaknesses}}}
  `,
});

const summarizePerformanceFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizePerformanceFeedbackFlow',
    inputSchema: SummarizePerformanceFeedbackInputSchema,
    outputSchema: SummarizePerformanceFeedbackOutputSchema,
  },
  async input => {
    const {output} = await summarizePerformanceFeedbackPrompt(input);
    return output!;
  }
);
