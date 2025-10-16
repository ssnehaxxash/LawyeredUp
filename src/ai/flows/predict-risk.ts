'use server';
/**
 * @fileOverview A risk prediction engine for legal documents.
 *
 * - predictRisk - A function that analyzes a legal document and highlights potential risks, liabilities, or unfavorable clauses.
 * - PredictRiskInput - The input type for the predictRisk function.
 * - PredictRiskOutput - The return type for the predictRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PredictRiskInputSchema = z.object({
  documentText: z.string().describe('The full text content of the legal document to be analyzed.'),
});
type PredictRiskInput = z.infer<typeof PredictRiskInputSchema>;

const RiskSchema = z.object({
    clauseId: z.string().describe('An identifier for the clause being analyzed (e.g., "C5").'),
    clauseText: z.string().describe('The full text of the risky clause.'),
    riskCategory: z.string().describe('The category of the risk (e.g., "Financial", "Liability", "Compliance").'),
    riskDescription: z.string().describe('A plain-language explanation of what the risk is.'),
    predictedImpact: z.string().describe('A prediction of how this clause could create future issues (e.g., "Could lead to unexpected costs," "Limits your rights in a dispute").'),
    severity: z.enum(["Low", "Medium", "High"]).describe("The severity of the potential risk."),
});

const PredictRiskOutputSchema = z.object({
    risks: z.array(RiskSchema).describe("An array of identified risks in the document."),
});
type PredictRiskOutput = z.infer<typeof PredictRiskOutputSchema>;

export async function predictRisk(input: PredictRiskInput): Promise<PredictRiskOutput> {
  return predictRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictRiskPrompt',
  input: {schema: PredictRiskInputSchema},
  output: {schema: PredictRiskOutputSchema},
  prompt: `[ROLE]
You are an AI risk prediction engine for legal documents. Your task is to act as a "risk radar," scanning legal jargon and pointing out where a user might face future issues.

[TASK]
Analyze the provided legal document. Identify potential risks, liabilities, or unfavorable clauses. For each risk, explain it and predict its future impact by comparing it against industry best practices, legal benchmarks, and common pitfalls.

[INSTRUCTIONS]
1. Read the entire document text to understand its context.
2. Go through the document clause by clause.
3. For each clause that contains a potential risk, create a risk object.
4. Each risk object must include:
    - 'clauseId': A unique identifier for the clause (e.g., "C1", "C2").
    - 'clauseText': The full text of the clause containing the risk.
    - 'riskCategory': The type of risk (e.g., "Financial", "Liability", "Compliance", "Termination").
    - 'riskDescription': A simple, clear explanation of the identified risk.
    - 'predictedImpact': An analysis of how this clause could cause problems in the future. Be specific.
    - 'severity': A "Low", "Medium", or "High" rating for the risk's potential severity.
5. If no risks are found, return an empty array of risks.
6. Return the result as a JSON object that matches the output schema.

[INPUT]
Document Text: "{{documentText}}"

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const predictRiskFlow = ai.defineFlow(
  {
    name: 'predictRiskFlow',
    inputSchema: PredictRiskInputSchema,
    outputSchema: PredictRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
