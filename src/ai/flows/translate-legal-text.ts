'use server';
/**
 * @fileOverview A multilingual legal assistant for translating text.
 *
 * - translateLegalText - A function that translates legal text to a specified language.
 * - TranslateLegalTextInput - The input type for the translateLegalText function.
 * - TranslateLegalTextOutput - The return type for the translateLegalText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TranslateLegalTextInputSchema = z.object({
  text_to_translate: z.string().describe('The legal text to be translated.'),
  target_language: z.string().describe('The language to translate the text into, e.g., "Hindi".'),
});
type TranslateLegalTextInput = z.infer<typeof TranslateLegalTextInputSchema>;

const TranslateLegalTextOutputSchema = z.object({
  original_text: z.string().describe("The original text that was provided for translation."),
  translated_text: z.string().describe("The translated text in the target language, using native script."),
  back_translation: z.string().describe("The English back-translation of the translated text to verify accuracy."),
  accuracy_notes: z.string().describe("Notes on the precision and legal accuracy of the translation."),
});
type TranslateLegalTextOutput = z.infer<typeof TranslateLegalTextOutputSchema>;

export async function translateLegalText(input: TranslateLegalTextInput): Promise<TranslateLegalTextOutput> {
  return translateLegalTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateLegalTextPrompt',
  input: {schema: TranslateLegalTextInputSchema},
  output: {schema: TranslateLegalTextOutputSchema},
  prompt: `[ROLE]
You are a multilingual legal assistant. Translate legal advice or documents into the user’s preferred language without losing meaning. Provide both native script and English back-translation for accuracy.

[INPUT]
Text to translate: "{text_to_translate}"
Target Language: "{target_language}"

[INSTRUCTIONS]
1. Translate the original text into the target language. Use the native script for that language.
2. Translate the generated text back into English to create a 'back-translation'.
3. Assess the accuracy of the translation, noting any nuances or potential loss of legal meaning.
4. Your response must be in JSON format matching the specified output schema.

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const translateLegalTextFlow = ai.defineFlow(
  {
    name: 'translateLegalTextFlow',
    inputSchema: TranslateLegalTextInputSchema,
    outputSchema: TranslateLegalTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
