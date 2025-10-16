'use server';

/**
 * @fileOverview A document summarization AI agent.
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
});
type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  overview: z.string().describe("A one-page summary of the contract's obligations, payments, rights, and risks at a Grade 10 reading level."),
  keyRisks: z.array(z.object({
    risk: z.string().describe("A key risk identified in the document."),
    impact: z.string().describe("The potential impact of the risk."),
  })).describe("An array of 3-5 key risks with plain explanations."),
  recommendedActions: z.array(z.string()).describe("A list of recommended next steps, such as negotiations or adding clauses."),
});
type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `[ROLE]
You are a legal simplifier. Your job is to produce a one-page TL;DR of the contract.

[INPUT]
Contract text: "{documentText}"

[INSTRUCTIONS]
1.  **Overview**: Create a concise summary of the key obligations, payments, rights, and overall purpose of the document. Keep the language at a Grade 10 reading level.
2.  **Key Risks**: Identify the top 3-5 most significant risks for the user. For each risk, describe the risk itself and its potential impact in a simple, clear way.
3.  **Recommended Actions**: Based on the risks and the document content, provide a list of concrete, actionable next steps for the user. These could include specific points to negotiate, clauses to clarify, or related documents to request (like an NDA).

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
