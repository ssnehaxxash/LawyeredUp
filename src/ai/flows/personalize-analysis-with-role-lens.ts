'use server';

/**
 * @fileOverview This flow personalizes the legal document analysis based on the selected role (e.g., tenant, landlord).
 *
 * - personalizeAnalysisWithRoleLens - A function that personalizes the legal document analysis based on the selected role.
 * - PersonalizeAnalysisWithRoleLensInput - The input type for the personalizeAnalysisWithRoleLens function.
 * - PersonalizeAnalysisWithRoleLensOutput - The return type for the personalizeAnalysisWithRoleLens function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeAnalysisWithRoleLensInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
  role: z
    .string()
    .describe('The role of the user (e.g., Tenant, Landlord, Employer).'),
});
type PersonalizeAnalysisWithRoleLensInput = z.infer<
  typeof PersonalizeAnalysisWithRoleLensInputSchema
>;

const PersonalizeAnalysisWithRoleLensOutputSchema = z.object({
  personalizedAnalysis: z
    .string()
    .describe('The personalized analysis of the legal document based on the selected role.'),
});
type PersonalizeAnalysisWithRoleLensOutput = z.infer<
  typeof PersonalizeAnalysisWithRoleLensOutputSchema
>;

export async function personalizeAnalysisWithRoleLens(
  input: PersonalizeAnalysisWithRoleLensInput
): Promise<PersonalizeAnalysisWithRoleLensOutput> {
  return personalizeAnalysisWithRoleLensFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeAnalysisWithRoleLensPrompt',
  input: {schema: PersonalizeAnalysisWithRoleLensInputSchema},
  output: {schema: PersonalizeAnalysisWithRoleLensOutputSchema},
  prompt: `You are a legal expert specializing in providing legal document analysis.

You will analyze the provided legal document and provide a personalized analysis based on the user's role.

Legal Document: {{{documentText}}}
User Role: {{{role}}}

Provide a detailed analysis, highlighting potential risks, benefits, and important clauses relevant to the user's role. Focus on the sections of the document that are most relevant to the role, and summarize those sections for the user.

Output the personalized analysis in a well-structured and easy-to-understand format. Be specific about the role's context and concerns.
`,
});

const personalizeAnalysisWithRoleLensFlow = ai.defineFlow(
  {
    name: 'personalizeAnalysisWithRoleLensFlow',
    inputSchema: PersonalizeAnalysisWithRoleLensInputSchema,
    outputSchema: PersonalizeAnalysisWithRoleLensOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
