
'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying risks within a legal document and suggesting counter-proposals.
 *
 * - identifyRisksAndSuggestCounterProposals - A function that takes legal document text as input, identifies potential risks, highlights risky clauses, and suggests counter-proposals.
 * - IdentifyRisksAndSuggestCounterProposalsInput - The input type for the identifyRisksAndSuggestCounterProposals function.
 * - IdentifyRisksAndSuggestCounterProposalsOutput - The return type for the identifyRisksAndSuggestCounterProposals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ClauseSchema } from '@/lib/schema';


const IdentifyRisksAndSuggestCounterProposalsInputSchema = z.object({
  clauses: z.array(ClauseSchema).describe("An array of clauses from the legal document, already parsed."),
});
export type IdentifyRisksAndSuggestCounterProposalsInput = z.infer<
  typeof IdentifyRisksAndSuggestCounterProposalsInputSchema
>;

const RiskObjectSchema = z.object({
  clauseId: z.string().describe("The unique identifier for the clause that contains the risk, e.g., 'C1'."),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).describe("The assessed risk level for the clause."),
  issue: z.string().describe("A clear description of the identified issue or risk."),
  suggestedChange: z.string().describe("The suggested wording or change to mitigate the risk."),
  isRisky: z.boolean().describe("A boolean flag indicating if the clause is risky.")
});

const IdentifyRisksAndSuggestCounterProposalsOutputSchema = z.array(RiskObjectSchema);

export type IdentifyRisksAndSuggestCounterProposalsOutput = z.infer<
  typeof IdentifyRisksAndSuggestCounterProposalsOutputSchema
>;

export async function identifyRisksAndSuggestCounterProposals(
  input: IdentifyRisksAndSuggestCounterProposalsInput
): Promise<IdentifyRisksAndSuggestCounterProposalsOutput> {
  return identifyRisksAndSuggestCounterProposalsFlow(input);
}

const identifyRisksAndSuggestCounterProposalsPrompt = ai.definePrompt({
  name: 'identifyRisksAndSuggestCounterProposalsPrompt',
  input: {schema: IdentifyRisksAndSuggestCounterProposalsInputSchema},
  output: {schema: IdentifyRisksAndSuggestCounterProposalsOutputSchema},
  prompt: `You are a legal AI assistant specializing in document parsing and risk identification. Your task is to analyze the provided array of legal clauses and identify potential risks.

[INSTRUCTIONS]
1. For each clause object in the input array, analyze its 'text' for:
   - Ambiguous language (e.g., "reasonable efforts").
   - Unfair obligations (e.g., high penalty fees).
   - Missing safeguards (termination rights, dispute resolution).
   - Jurisdictional risks (laws favoring one party unfairly).
2. For each identified risk, create an object containing:
   - The original 'clauseId' from the input object.
   - A riskLevel of "LOW", "MEDIUM", or "HIGH".
   - A clear description of the issue.
   - A suggested improved wording or change to mitigate the risk.
   - A boolean 'isRisky' flag set to true.
3. If a clause has no risk, do not include it in the output.
4. Return an array of these risk objects. If no risks are found, return an empty array.


[INPUT]
Clauses: {{{clauses}}}

[OUTPUT FORMAT] (JSON Array)
Format the response as a JSON array of objects that match the output schema.
`,
});

const identifyRisksAndSuggestCounterProposalsFlow = ai.defineFlow(
  {
    name: 'identifyRisksAndSuggestCounterProposalsFlow',
    inputSchema: IdentifyRisksAndSuggestCounterProposalsInputSchema,
    outputSchema: IdentifyRisksAndSuggestCounterProposalsOutputSchema,
  },
  async input => {
    const {output} = await identifyRisksAndSuggestCounterProposalsPrompt(input);
    return output!;
  }
);
