'use server';
/**
 * @fileOverview A document parsing AI agent for legal documents, with OCR capabilities.
 *
 * - parseUploadedDocument - A function that handles the document parsing process.
 * - ParseUploadedDocumentInput - The input type for the parseUploadeddocument function.
 * - ParseUploadedDocumentOutput - The return type for the parseUploadeddocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { ClauseSchema } from '@/lib/schema';

const ParseUploadedDocumentInputSchema = z.object({
  documentText: z.string().optional().describe('The full text content of the legal document to be parsed.'),
  documentDataUri: z.string().optional().describe("A document file (like a scanned PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ParseUploadedDocumentInput = z.infer<typeof ParseUploadedDocumentInputSchema>;

const ParseUploadedDocumentOutputSchema = z.object({
  title: z.string().describe('The main title of the legal document.'),
  docType: z.string().describe('The type of document, e.g., "Rental Agreement", "Employment Contract".'),
  parties: z.array(z.string()).describe('The parties involved, like "Landlord", "Tenant", "Employer", "Employee".'),
  dates: z.object({
    startDate: z.string().describe('The effective or start date of the document.'),
    endDate: z.string().describe('The expiry or end date of the document, if specified.'),
  }),
  financialTerms: z.array(z.string()).describe('A list of key financial obligations, such as rent, salary, or penalties.'),
  clauses: z.array(ClauseSchema),
  summary: z.string().describe("A one-paragraph summary of the document's key points, risks, and purpose."),
  structuralIssues: z.array(z.string()).describe('A list of any detected structural issues, like missing signatures or undefined terms.'),
});
export type ParseUploadedDocumentOutput = z.infer<typeof ParseUploadedDocumentOutputSchema>;

export async function parseUploadedDocument(input: ParseUploadedDocumentInput): Promise<ParseUploadedDocumentOutput> {
  return parseUploadedDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseUploadedDocumentPrompt',
  input: {schema: ParseUploadedDocumentInputSchema},
  output: {schema: ParseUploadedDocumentOutputSchema},
  prompt: `[ROLE]
You are a legal AI assistant for LawyeredUp with advanced OCR capabilities. The user has provided a legal document.

[INSTRUCTIONS]
1. Determine the source of the document. If 'documentDataUri' is provided, it is a scanned document (e.g., image-based PDF). Prioritize it and use OCR to extract all text. If only 'documentText' is provided, use that.
2. After extracting text (especially from OCR), normalize it. This means fixing words broken across lines, removing OCR artifacts or page numbers, and reconstructing clean paragraphs and clauses.
3. Once you have clean text, parse it to extract document metadata:
   - Title
   - Parties involved (e.g., Employer, Employee, Landlord, Tenant)
   - Dates (effective, expiry, renewal)
   - Financial obligations (rent, salary, deposit, penalties, etc.)
   - Jurisdiction / governing law
4. Break down the document into individual clauses. For each clause, you must:
   - Assign a unique ID (e.g., "C1", "C2").
   - Identify its 'type' from standard legal categories (e.g., "Termination", "Payment", "Confidentiality", "Governing Law", etc.).
   - Extract the full 'text' of the clause.
   - Set a 'riskFlag'. Mark it as "unusual" if it contains language that is non-standard, one-sided, or potentially risky. Otherwise, mark it as "standard".
   - Provide a brief 'explanation' only if the riskFlag is "unusual".
5. **Generate a one-paragraph 'summary'** of the document's key purpose, obligations, and overall risk level.
6. Detect structural issues (e.g., missing signatures, undefined terms).
7. Return the result in JSON format matching the output schema.

[INPUT]
{{#if documentDataUri}}
Document File: {{media url=documentDataUri}}
{{else}}
Document Text: "{{documentText}}"
{{/if}}


[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const parseUploadedDocumentFlow = ai.defineFlow(
  {
    name: 'parseUploadedDocumentFlow',
    inputSchema: ParseUploadedDocumentInputSchema,
    outputSchema: ParseUploadedDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
