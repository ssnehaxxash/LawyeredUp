'use server';
/**
 * @fileOverview A compliance tracking AI assistant.
 *
 * - trackCompliance - A function that identifies and tracks obligations with deadlines.
 * - TrackComplianceInput - The input type for the trackCompliance function.
 * - TrackComplianceOutput - The return type for the trackCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TrackComplianceInputSchema = z.object({
  documentText: z.string().describe('The full text content of the legal document.'),
});
type TrackComplianceInput = z.infer<typeof TrackComplianceInputSchema>;

const TrackComplianceOutputSchema = z.array(
    z.object({
        obligationId: z.string().describe('A unique identifier for the obligation, e.g., "O1".'),
        description: z.string().describe('A clear description of the obligation.'),
        dueDate: z.string().describe('The due date for the obligation, formatted as YYYY-MM-DD.'),
        frequency: z.enum(["one-time", "monthly", "yearly", "recurring"]).describe('The frequency of the obligation.'),
    })
);
type TrackComplianceOutput = z.infer<typeof TrackComplianceOutputSchema>;

export async function trackCompliance(input: TrackComplianceInput): Promise<TrackComplianceOutput> {
  return trackComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trackCompliancePrompt',
  input: {schema: TrackComplianceInputSchema},
  output: {schema: TrackComplianceOutputSchema},
  prompt: `[ROLE]
You are a compliance assistant. Your task is to identify all obligations with deadlines from the provided contract text.

[INSTRUCTIONS]
1.  Read the document and identify key obligations such as payment due dates, contract renewal dates, reporting requirements, notice periods, etc.
2.  For each obligation, create a unique ID.
3.  Describe the obligation clearly.
4.  Specify the due date in YYYY-MM-DD format.
5.  Determine the frequency (one-time, monthly, yearly, recurring).
6.  Return the data as a JSON array of objects.

[INPUT]
Document Text: "{{documentText}}"

[OUTPUT FORMAT] (JSON Array)
Respond with a JSON array that matches the output schema.
`,
});

const trackComplianceFlow = ai.defineFlow(
  {
    name: 'trackComplianceFlow',
    inputSchema: TrackComplianceInputSchema,
    outputSchema: TrackComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
