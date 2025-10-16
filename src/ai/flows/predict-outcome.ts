'use server';
/**
 * @fileOverview A legal prediction AI for estimating case outcomes.
 *
 * - predictOutcome - A function that estimates probable outcomes for a legal case.
 * - PredictOutcomeInput - The input type for the predictOutcome function.
 * - PredictOutcomeOutput - The return type for the predictOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PredictOutcomeInputSchema = z.object({
  caseType: z.string().describe('The type of legal case, e.g., "Employment Dispute".'),
  jurisdiction: z.string().describe('The jurisdiction where the case is filed, e.g., "Bangalore".'),
  involvedParties: z.string().describe('Description of the parties involved, e.g., "Employee vs. Company".'),
  evidenceStrength: z.string().describe('Summary of the strength of evidence for the user.'),
  pastJudgments: z.string().describe('Notes on relevant past judgments or precedents.'),
});
type PredictOutcomeInput = z.infer<typeof PredictOutcomeInputSchema>;

const PredictOutcomeOutputSchema = z.object({
  predicted_outcomes: z.array(z.string()).describe('A list of probable outcomes, e.g., "Win", "Lose", "Settlement".'),
  probabilities: z.record(z.string(), z.number()).describe('A dictionary mapping each outcome to a probability percentage.'),
  reasoning: z.array(z.string()).describe('The reasoning behind the prediction, citing relevant factors.'),
  recommended_action: z.string().describe('The suggested next best step for the user.'),
});
type PredictOutcomeOutput = z.infer<typeof PredictOutcomeOutputSchema>;

export async function predictOutcome(input: PredictOutcomeInput): Promise<PredictOutcomeOutput> {
  return predictOutcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictOutcomePrompt',
  input: {schema: PredictOutcomeInputSchema},
  output: {schema: PredictOutcomeOutputSchema},
  prompt: `[ROLE]
You are a legal prediction AI trained on structured case histories, judgments, and regional court trends.

[INPUT DATA]
Case Type: "{caseType}"
Jurisdiction: "{jurisdiction}"
Involved Parties: "{involvedParties}"
Evidence Strength: "{evidenceStrength}"
Past Judgments: "{pastJudgments}"

[INSTRUCTIONS]
1. Estimate probable outcomes (e.g., win/lose/settlement/appeal).
2. Assign probability percentages for each outcome.
3. Provide reasoning for each prediction, citing jurisdictional delays, typical rulings, and evidence weight.
4. Suggest the next best step (e.g., mediation vs. litigation).
5. Your response must be in JSON format matching the specified output schema.

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const predictOutcomeFlow = ai.defineFlow(
  {
    name: 'predictOutcomeFlow',
    inputSchema: PredictOutcomeInputSchema,
    outputSchema: PredictOutcomeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
