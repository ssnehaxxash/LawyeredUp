'use server';
/**
 * @fileOverview Answers user questions based on the provided contract text.
 *
 * - answerQuestionFromDocument - A function that answers a user's question based on the document.
 * - AnswerQuestionFromDocumentInput - The input type for the answerQuestionFromDocument function.
 * - AnswerQuestionFromDocumentOutput - The return type for the answerQuestionFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnswerQuestionFromDocumentInputSchema = z.object({
  user_question: z.string().describe("The user's question about the contract."),
  contract_text: z.string().describe('The full text of the contract.'),
});
type AnswerQuestionFromDocumentInput = z.infer<typeof AnswerQuestionFromDocumentInputSchema>;

const AnswerQuestionFromDocumentOutputSchema = z.object({
  user_question: z.string().describe("The original user question."),
  answer: z.string().describe("The answer to the user's question, based only on the contract text."),
  sourceClauseText: z.string().describe("The specific clause from the contract that supports the answer. If not found, this will be an empty string."),
});
type AnswerQuestionFromDocumentOutput = z.infer<typeof AnswerQuestionFromDocumentOutputSchema>;

export async function answerQuestionFromDocument(input: AnswerQuestionFromDocumentInput): Promise<AnswerQuestionFromDocumentOutput> {
  return answerQuestionFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionFromDocumentPrompt',
  input: {schema: AnswerQuestionFromDocumentInputSchema},
  output: {schema: AnswerQuestionFromDocumentOutputSchema},
  prompt: `[ROLE]
You are a legal explainer who answers user questions based ONLY on provided contract text.

[INPUT]
User question: "{user_question}"
Contract text: "{contract_text}"

[INSTRUCTIONS]
1. Search all clauses for relevant answers.
2. Always cite the clause text where the answer comes from in the 'sourceClauseText' field.
3. Provide plain English answers (ELI15 level).
4. If the answer is unclear, ambiguous, or not present in the contract, the 'answer' field should be: "This clause is unclear — please consult a lawyer." and 'sourceClauseText' should be empty.
5. Avoid assumptions or invented answers.

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const answerQuestionFromDocumentFlow = ai.defineFlow(
  {
    name: 'answerQuestionFromDocumentFlow',
    inputSchema: AnswerQuestionFromDocumentInputSchema,
    outputSchema: AnswerQuestionFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
