'use server';
/**
 * @fileOverview A contract comparison AI agent for finding differences between two versions of a document.
 *
 * - compareDocuments - A function that compares two versions of a legal document.
 * - CompareDocumentsInput - The input type for the compareDocuments function.
 * - CompareDocumentsOutput - The return type for the compareDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CompareDocumentsInputSchema = z.object({
  docText1: z.string().describe('The text content of the old version of the contract.'),
  docText2: z.string().describe('The text content of the new version of the contract.'),
});
type CompareDocumentsInput = z.infer<typeof CompareDocumentsInputSchema>;

const CompareDocumentsOutputSchema = z.array(
  z.object({
    clauseType: z.string().describe('The type of clause that has changed (e.g., "Termination").'),
    oldText: z.string().describe('The relevant text from the old version.'),
    newText: z.string().describe('The relevant text from the new version.'),
    changeImpact: z.string().describe('A plain-language explanation of the change and its potential impact.'),
  })
);
type CompareDocumentsOutput = z.infer<typeof CompareDocumentsOutputSchema>;

export async function compareDocuments(input: CompareDocumentsInput): Promise<CompareDocumentsOutput> {
  return compareDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareDocumentsPrompt',
  input: {schema: CompareDocumentsInputSchema},
  output: {schema: CompareDocumentsOutputSchema},
  prompt: `[ROLE]
You are a legal AI assistant specializing in comparing two versions of the same contract to create a "redline" or "delta" view.

[TASK]
Your goal is to compare two versions of a document and highlight what has changed, explaining the impact of those changes.

[INSTRUCTIONS]
1.  Carefully read both contract texts provided (Old Version and New Version).
2.  Go through the documents clause by clause and identify any differences.
3.  For each material change you find, create an object describing the change. Include:
    - The type of clause affected.
    - The specific text from the old version.
    - The new text in the new version.
    - A plain-language explanation of the impact (e.g., "Reduces time for tenant to vacate, which is a higher risk for the tenant.").
4.  If there are no differences, return an empty array.

[INPUT]
Old Version Text: "{docText1}"
New Version Text: "{docText2}"

[OUTPUT FORMAT] (JSON Array)
Respond with a JSON array of objects that matches the output schema.
`,
});

const compareDocumentsFlow = ai.defineFlow(
  {
    name: 'compareDocumentsFlow',
    inputSchema: CompareDocumentsInputSchema,
    outputSchema: CompareDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
