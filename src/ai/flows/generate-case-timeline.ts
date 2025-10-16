'use server';
/**
 * @fileOverview A legal case lifecycle AI assistant.
 *
 * - generateCaseTimeline - A function that generates a comprehensive case timeline.
 * - GenerateCaseTimelineInput - The input type for the generateCaseTimeline function.
 * - GenerateCaseTimelineOutput - The return type for the generateCaseTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateCaseTimelineInputSchema = z.object({
  caseId: z.string().describe('The unique identifier for the case.'),
  caseType: z.string().describe('The type of legal case, e.g., "Employment Dispute".'),
  jurisdiction: z.string().describe('The jurisdiction where the case is filed, e.g., "Bangalore District Court".'),
  lastKnownStatus: z.string().describe('The last known status or event in the case, e.g., "Last hearing was July 2025".'),
});
type GenerateCaseTimelineInput = z.infer<typeof GenerateCaseTimelineInputSchema>;

const GenerateCaseTimelineOutputSchema = z.object({
  current_stage: z.string().describe('The current stage of the case lifecycle.'),
  context_notes: z.string().describe('Contextual notes about the current stage.'),
  next_milestones: z.array(z.object({
    event: z.string().describe('The name of the upcoming milestone.'),
    expected_date: z.string().describe('The expected date for this milestone.'),
  })).describe('A list of upcoming milestones with deadlines and dependencies.'),
  expected_timeline: z.object({
    best_case: z.string().describe('The best-case resolution timeline.'),
    average_case: z.string().describe('The average or most likely resolution timeline.'),
    worst_case: z.string().describe('The worst-case resolution timeline, considering potential delays.'),
  }).describe('The estimated resolution timeline with uncertainty factors.'),
  delay_risks: z.array(z.string()).describe('A list of potential risks that could delay the case.'),
  acceleration_tips: z.array(z.string()).describe('Suggested actions the user can take to potentially speed up the process.'),
  required_documents: z.array(z.string()).describe('A list of documents or actions the user should prepare for the next stage.'),
  historical_precedent: z.object({
    similar_cases_in_jurisdiction: z.string().describe('The average duration of similar cases in the same jurisdiction.'),
    fastest_case: z.string().describe('The fastest recorded resolution for a similar case.'),
    longest_case: z.string().describe('The longest recorded resolution for a similar case.'),
  }).describe('Data on the speed of historical precedents for similar cases.'),
});
type GenerateCaseTimelineOutput = z.infer<typeof GenerateCaseTimelineOutputSchema>;

export async function generateCaseTimeline(input: GenerateCaseTimelineInput): Promise<GenerateCaseTimelineOutput> {
  return generateCaseTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaseTimelinePrompt',
  input: {schema: GenerateCaseTimelineInputSchema},
  output: {schema: GenerateCaseTimelineOutputSchema},
  prompt: `[ROLE]
You are a legal case lifecycle AI assistant.

[INPUT DATA]
Case ID: "{caseId}"
Case Type: "{caseType}"
Jurisdiction: "{jurisdiction}"
Last Known Status: "{lastKnownStatus}"

[INSTRUCTIONS]
Given the case profile, generate a comprehensive case timeline including:
1. Current stage analysis with contextual notes.
2. Upcoming milestones with deadlines and dependencies.
3. Estimated resolution timeline with uncertainty factors (best, average, worst case).
4. Risks of delay and suggested actions to speed up.
5. Required documents/actions the user should prepare.
6. Historical precedent speed (average duration of similar cases in the same jurisdiction).

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const generateCaseTimelineFlow = ai.defineFlow(
  {
    name: 'generateCaseTimelineFlow',
    inputSchema: GenerateCaseTimelineInputSchema,
    outputSchema: GenerateCaseTimelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
