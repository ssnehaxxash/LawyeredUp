'use server';
/**
 * @fileOverview A legal-financial AI advisor.
 *
 * - generateCostForecast - A function that generates a detailed cost forecast for a legal case.
 * - GenerateCostForecastInput - The input type for the generateCostForecast function.
 * - GenerateCostForecastOutput - The return type for the generateCostForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateCostForecastInputSchema = z.object({
  caseType: z.string().describe('The type of legal case, e.g., "Divorce".'),
  jurisdiction: z.string().describe('The jurisdiction where the case is filed, e.g., "Bangalore".'),
  complexity: z.string().describe('The complexity of the case, e.g., "Contested with child custody claim".'),
  lawyerType: z.string().describe('The tier of lawyer hired, e.g., "mid-tier".'),
});
type GenerateCostForecastInput = z.infer<typeof GenerateCostForecastInputSchema>;

const GenerateCostForecastOutputSchema = z.object({
  estimated_expenses: z.string().describe('The total estimated expense range.'),
  breakdown: z.object({
    Lawyer_fees: z.string().describe('Estimated lawyer fees.'),
    Court_fees: z.string().describe('Estimated court fees.'),
    Documentation: z.string().describe('Estimated documentation costs.'),
    Travel: z.string().describe('Estimated travel expenses.'),
    Expert_witnesses: z.string().describe('Estimated costs for expert witnesses.'),
    Miscellaneous: z.string().describe('Estimated miscellaneous costs.'),
  }),
  billing_model: z.object({
    type: z.string().describe('The assumed billing model (e.g., "Mixed (retainer + hourly)").'),
    retainer_amount: z.string().describe('The upfront retainer amount, if any.'),
    hourly_rate: z.string().describe('The hourly rate for hearings or other work.'),
  }),
  cost_escalators: z.array(z.string()).describe('A list of possible cost escalators.'),
  cost_reduction_tips: z.array(z.object({
    tip: z.string().describe('A specific cost-reduction strategy.'),
    practicality: z.string().describe('The practicality of the tip (e.g., "High", "Medium", "Low").'),
  })),
  funding_options: z.array(z.string()).describe('A list of potential funding or aid options.'),
  confidence_level: z.string().describe('The confidence level of the estimate (e.g., "High", "Medium", "Low").'),
  data_sources: z.array(z.string()).describe('The data sources used for the estimates.'),
});
type GenerateCostForecastOutput = z.infer<typeof GenerateCostForecastOutputSchema>;

export async function generateCostForecast(input: GenerateCostForecastInput): Promise<GenerateCostForecastOutput> {
  return generateCostForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCostForecastPrompt',
  input: {schema: GenerateCostForecastInputSchema},
  output: {schema: GenerateCostForecastOutputSchema},
  prompt: `[ROLE]
You are a legal-financial AI advisor.

[CASE PROFILE]
Case Type: "{caseType}"
Jurisdiction: "{jurisdiction}"
Complexity: "{complexity}"
Lawyer Type: "{lawyerType}"

[INSTRUCTIONS]
Given the case profile, generate a detailed cost forecast including:
1. Total estimated expense range.
2. Breakdown by category (lawyer fees, court fees, documentation, travel, expert witnesses, miscellaneous).
3. Billing model assumptions (hourly, flat fee, retainer).
4. Possible cost escalators (appeals, adjournments, delays).
5. Cost-reduction strategies with practicality ratings (High, Medium, Low).
6. Funding/aid options (legal aid, insurance coverage, etc.).
7. Confidence level and data sources used for estimates.

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const generateCostForecastFlow = ai.defineFlow(
  {
    name: 'generateCostForecastFlow',
    inputSchema: GenerateCostForecastInputSchema,
    outputSchema: GenerateCostForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
