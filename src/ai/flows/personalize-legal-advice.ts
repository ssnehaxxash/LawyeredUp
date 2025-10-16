'use server';
/**
 * @fileOverview A personalized legal advisor AI.
 *
 * - personalizeLegalAdvice - A function that generates personalized legal advice based on a user's profile.
 * - PersonalizeLegalAdviceInput - The input type for the personalizeLegalAdvice function.
 * - PersonalizeLegalAdviceOutput - The return type for the personalizeLegalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PersonalizeLegalAdviceInputSchema = z.object({
  location: z.string().describe("The user's geographical location, e.g., 'Pune'."),
  profession: z.string().describe("The user's profession or business type, e.g., 'small business owner'."),
  profileSummary: z.string().describe("A summary of the user's activities and history, e.g., 'signs frequent vendor contracts, previously had a delayed payment dispute with a supplier.'"),
});
type PersonalizeLegalAdviceInput = z.infer<typeof PersonalizeLegalAdviceInputSchema>;

const PersonalizeLegalAdviceOutputSchema = z.object({
  personalized_insights: z.array(z.string()).describe("Common risks or insights relevant to the user's field and history."),
  region_updates: z.array(z.string()).describe("Region-specific legal updates relevant to the user."),
  red_flags: z.array(z.string()).describe("Contractual red flags to watch out for, tailored to the user profile."),
  proactive_strategies: z.array(z.string()).describe("Proactive legal strategies like insurance, contract modifications, etc."),
});
type PersonalizeLegalAdviceOutput = z.infer<typeof PersonalizeLegalAdviceOutputSchema>;

export async function personalizeLegalAdvice(input: PersonalizeLegalAdviceInput): Promise<PersonalizeLegalAdviceOutput> {
  return personalizeLegalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeLegalAdvicePrompt',
  input: {schema: PersonalizeLegalAdviceInputSchema},
  output: {schema: PersonalizeLegalAdviceOutputSchema},
  prompt: `[ROLE]
You are a personalized legal advisor AI.

[USER PROFILE]
Location: "{location}"
Profession: "{profession}"
Profile Summary: "{profileSummary}"

[INSTRUCTIONS]
1.  Generate personalized legal insights (e.g., common risks in user’s field, upcoming compliance deadlines).
2.  Flag region-specific legal updates relevant to the user.
3.  Provide contractual red flags to watch out for (tailored to user profile).
4.  Suggest proactive legal strategies (e.g., insurance, contract modifications, preventive filings).

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const personalizeLegalAdviceFlow = ai.defineFlow(
  {
    name: 'personalizeLegalAdviceFlow',
    inputSchema: PersonalizeLegalAdviceInputSchema,
    outputSchema: PersonalizeLegalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
