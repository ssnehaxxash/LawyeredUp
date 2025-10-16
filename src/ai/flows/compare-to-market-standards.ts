'use server';
/**
 * @fileOverview An AI agent that compares contract clauses to market standards.
 *
 * - compareToMarketStandards - A function that compares clauses to industry norms.
 * - CompareToMarketStandardsInput - The input type for the compareToMarketStandards function.
 * - CompareToMarketStandardsOutput - The return type for the compareToMarketStandards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CompareToMarketStandardsInputSchema = z.object({
  documentText: z.string().describe('The full text content of the legal document.'),
});
type CompareToMarketStandardsInput = z.infer<typeof CompareToMarketStandardsInputSchema>;

const CompareToMarketStandardsOutputSchema = z.array(
  z.object({
    clauseId: z.string().describe('An identifier for the clause being analyzed (e.g., "C2").'),
    type: z.string().describe('The type of clause, e.g., "Deposit", "Notice Period".'),
    standard: z.string().describe('The typical market standard for this type of clause.'),
    contractValue: z.string().describe('The specific value or term found in the user\'s contract.'),
    comment: z.string().describe('A comment on how the contract\'s clause deviates from the standard and the potential impact.'),
  })
);
type CompareToMarketStandardsOutput = z.infer<typeof CompareToMarketStandardsOutputSchema>;

export async function compareToMarketStandards(input: CompareToMarketStandardsInput): Promise<CompareToMarketStandardsOutput> {
  return compareToMarketStandardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareToMarketStandardsPrompt',
  input: {schema: CompareToMarketStandardsInputSchema},
  output: {schema: CompareToMarketStandardsOutputSchema},
  prompt: `[ROLE]
You are a legal AI expert with deep knowledge of market standards for common contract clauses across various industries and jurisdictions.

[TASK]
Your goal is to analyze the provided contract text, identify key clauses with quantifiable or standard terms, and compare them against industry norms.

[INSTRUCTIONS]
1.  Read the entire document to understand its context.
2.  Identify clauses that have standard market rates, terms, or language (e.g., Security Deposit, Notice Period, Liability Caps, Termination Fees).
3.  For each identified clause, create an object containing:
    -   \`clauseId\`: A simple identifier for the clause (e.g., C1, C2).
    -   \`type\`: The type of clause (e.g., "Security Deposit").
    -   \`standard\`: The market standard value or range (e.g., "1-2 months' rent").
    -   \`contractValue\`: The value specified in the actual contract (e.g., "6 months' rent").
    -   \`comment\`: A brief explanation of the deviation and its potential impact (e.g., "Uncommon, heavily favors landlord.").
4.  Focus on material deviations from the norm. If a clause is standard, you do not need to include it.
5.  Return the results as a JSON array. If no significant deviations are found, return an empty array.

[INPUT]
Document Text: "{{documentText}}"

[OUTPUT FORMAT] (JSON Array)
Respond with a JSON array of objects that matches the output schema.
`,
});

const compareToMarketStandardsFlow = ai.defineFlow(
  {
    name: 'compareToMarketStandardsFlow',
    inputSchema: CompareToMarketStandardsInputSchema,
    outputSchema: CompareToMarketStandardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
