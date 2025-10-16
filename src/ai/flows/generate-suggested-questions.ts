'use server';
/**
 * @fileOverview Generates suggested questions based on a legal document.
 *
 * - generateSuggestedQuestions - A function that suggests questions based on the document text.
 * - GenerateSuggestedQuestionsInput - The input type for the generateSuggestedQuestions function.
 * - GenerateSuggestedQuestionsOutput - The return type for the generateSuggestedQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateSuggestedQuestionsInputSchema = z.object({
  documentText: z.string().describe('The full text of the legal document.'),
});
type GenerateSuggestedQuestionsInput = z.infer<typeof GenerateSuggestedQuestionsInputSchema>;

const GenerateSuggestedQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe("An array of 3-4 suggested questions about the document."),
});
type GenerateSuggestedQuestionsOutput = z.infer<typeof GenerateSuggestedQuestionsOutputSchema>;

export async function generateSuggestedQuestions(input: GenerateSuggestedQuestionsInput): Promise<GenerateSuggestedQuestionsOutput> {
  return generateSuggestedQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSuggestedQuestionsPrompt',
  input: {schema: GenerateSuggestedQuestionsInputSchema},
  output: {schema: GenerateSuggestedQuestionsOutputSchema},
  prompt: `[ROLE]
You are a helpful legal assistant. Your task is to read the provided legal document and generate 3-4 insightful questions that a user might have about its content.

[INSTRUCTIONS]
1. Read the provided contract text to understand its purpose and key terms.
2. Focus on areas that involve risk, obligations, deadlines, or financial amounts.
3. Generate 3 to 4 distinct questions in plain language.
4. The questions should be things that can likely be answered from the text of the document itself.
5. Return the questions in a JSON array.

[INPUT]
Contract text: "{documentText}"

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const generateSuggestedQuestionsFlow = ai.defineFlow(
  {
    name: 'generateSuggestedQuestionsFlow',
    inputSchema: GenerateSuggestedQuestionsInputSchema,
    outputSchema: GenerateSuggestedQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
