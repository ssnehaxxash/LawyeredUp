'use server';
/**
 * @fileOverview An AI agent that detects uncertainty in legal clause interpretation.
 *
 * - flagUncertainClauses - A function that identifies ambiguous clauses and assigns a confidence score.
 * - FlagUncertainClausesInput - The input type for the flagUncertainClauses function.
 * - FlagUncertainClausesOutput - The return type for the flagUncertainClauses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const FlagUncertainClausesInputSchema = z.object({
  documentText: z.string().describe('The full text content of the legal document.'),
});
type FlagUncertainClausesInput = z.infer<typeof FlagUncertainClausesInputSchema>;

const FlagUncertainClausesOutputSchema = z.array(
  z.object({
    clauseId: z.string().describe('An identifier for the clause being analyzed (e.g., "C7").'),
    confidence: z.number().describe('A confidence score from 0 to 100 on the clarity of the clause.'),
    warning: z.string().describe('A warning message if the confidence score is low, advising legal consultation.'),
  })
);
type FlagUncertainClausesOutput = z.infer<typeof FlagUncertainClausesOutputSchema>;

export async function flagUncertainClauses(input: FlagUncertainClausesInput): Promise<FlagUncertainClausesOutput> {
  return flagUncertainClausesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagUncertainClausesPrompt',
  input: {schema: FlagUncertainClausesInputSchema},
  output: {schema: FlagUncertainClausesOutputSchema},
  prompt: `[ROLE]
You are a legal AI that specializes in identifying ambiguity and uncertainty in legal text.

[TASK]
Your task is to read the provided document, identify clauses that are ambiguous, vague, or poorly worded, and assign a confidence score to the clarity and interpretability of each problematic clause.

[INSTRUCTIONS]
1.  Parse the document to identify individual clauses. For each clause, create a simple ID (e.g., C1, C2).
2.  Analyze each clause for ambiguity. Look for undefined terms, subjective language (e.g., "reasonable", "best efforts"), or conflicting statements.
3.  For each clause you identify as ambiguous, create an object that includes:
    -   'clauseId': The identifier for the clause.
    -   'confidence': A score from 0-100 representing your confidence in the clarity of the clause. A lower score means more ambiguity.
    -   'warning': If the confidence score is below 80, provide a warning like "Ambiguous [clause type] clause. Seek legal advice."
4.  Only include clauses in the output array that you deem to have some level of uncertainty (i.e., confidence < 100). If all clauses are clear, return an empty array.

[INPUT]
Document Text: "{{documentText}}"

[OUTPUT FORMAT] (JSON Array)
Respond with a JSON array of objects that matches the output schema.
`,
});

const flagUncertainClausesFlow = ai.defineFlow(
  {
    name: 'flagUncertainClausesFlow',
    inputSchema: FlagUncertainClausesInputSchema,
    outputSchema: FlagUncertainClausesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
