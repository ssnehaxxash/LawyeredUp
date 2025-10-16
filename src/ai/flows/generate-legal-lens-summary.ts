'use server';
/**
 * @fileOverview A personalized summary generator for different audiences.
 *
 * - generateLegalLensSummary - A function that generates summaries for different audiences.
 * - GenerateLegalLensSummaryInput - The input type for the generateLegalLensSummary function.
 * - GenerateLegalLensSummaryOutput - The return type for the generateLegalLensSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateLegalLensSummaryInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
});
type GenerateLegalLensSummaryInput = z.infer<typeof GenerateLegalLensSummaryInputSchema>;

const GenerateLegalLensSummaryOutputSchema = z.object({
  professional: z.string().describe('A summary for a professional lawyer, using precise legal terminology and focusing on enforceability and compliance.'),
  layman: z.string().describe("A simplified summary in plain English, explaining obligations for a non-lawyer."),
  riskSummary: z.string().describe('A summary that highlights risks and potential financial or operational consequences.'),
});
type GenerateLegalLensSummaryOutput = z.infer<typeof GenerateLegalLensSummaryOutputSchema>;

export async function generateLegalLensSummary(input: GenerateLegalLensSummaryInput): Promise<GenerateLegalLensSummaryOutput> {
  return generateLegalLensSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLegalLensSummaryPrompt',
  input: {schema: GenerateLegalLensSummaryInputSchema},
  output: {schema: GenerateLegalLensSummaryOutputSchema},
  prompt: `[ROLE]
You are a legal summarization expert. Your task is to generate three distinct summaries of the provided legal document for different audiences.

[INPUT]
Document Text: "{{documentText}}"

[INSTRUCTIONS]
Generate the following three summaries:
1.  **Professional Lawyer View**: Use precise legal terminology. Focus on enforceability, compliance, potential liabilities, and legal precedent.
2.  **Layman's Simplified View**: Use plain, simple English. Explain the key obligations, rights, and responsibilities as if you were guiding a non-lawyer.
3.  **Risk-Focused Summary**: Exclusively highlight the clauses that pose financial, operational, or legal risks. Clearly state what the risk is and what its potential consequences are.

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema, containing keys for "professional", "layman", and "riskSummary".
`,
});

const generateLegalLensSummaryFlow = ai.defineFlow(
  {
    name: 'generateLegalLensSummaryFlow',
    inputSchema: GenerateLegalLensSummaryInputSchema,
    outputSchema: GenerateLegalLensSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
