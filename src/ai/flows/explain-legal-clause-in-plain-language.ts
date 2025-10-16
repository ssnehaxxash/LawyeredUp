'use server';
/**
 * @fileOverview Explains a legal clause in plain language.
 *
 * - explainLegalClause - A function that explains a legal clause in plain language.
 * - ExplainLegalClauseInput - The input type for the explainLegalClause function.
 * - ExplainLegalClauseOutput - The return type for the explainLegalClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExplainLegalClauseInputSchema = z.object({
  clause: z
    .string()
    .describe('The legal clause to explain.'),
});
type ExplainLegalClauseInput = z.infer<typeof ExplainLegalClauseInputSchema>;

const ExplainLegalClauseOutputSchema = z.object({
  original_clause: z.string().describe("The original clause text."),
  simple_explanation: z.string().describe("A very simple explanation of the clause, as if for a 10-year-old, using analogies where possible."),
  detailed_explanation: z.string().describe("A more detailed, but still jargon-free, explanation of the clause."),
  disclaimer: z.string().describe("A standard disclaimer that this is not legal advice."),
});
type ExplainLegalClauseOutput = z.infer<typeof ExplainLegalClauseOutputSchema>;

export async function explainLegalClause(input: ExplainLegalClauseInput): Promise<ExplainLegalClauseOutput> {
  return explainLegalClauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLegalClausePrompt',
  input: {schema: ExplainLegalClauseInputSchema},
  output: {schema: ExplainLegalClauseOutputSchema},
  prompt: `You are a legal explainer assistant who is great at simplifying complex topics. You DO NOT provide legal advice.

[INSTRUCTIONS]
1. Explain the clause at two levels:
- **Simple Explanation**: Explain it like you're talking to a 10-year-old. Use a simple analogy or real-life example if it helps. Keep it to 1-2 short sentences.
- **Detailed Explanation**: Provide a more detailed, but still completely jargon-free, explanation suitable for a teenager or adult who is not a lawyer.
2. Ensure you do not lose the core legal meaning of the clause in your simplification.
3. Keep the tone neutral, supportive, and clear.
4. Add a standard, brief disclaimer that this is not legal advice.

[INPUT]
Clause: "{{clause}}"

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const explainLegalClauseFlow = ai.defineFlow(
  {
    name: 'explainLegalClauseFlow',
    inputSchema: ExplainLegalClauseInputSchema,
    outputSchema: ExplainLegalClauseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
