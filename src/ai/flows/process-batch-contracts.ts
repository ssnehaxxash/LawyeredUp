'use server';
/**
 * @fileOverview An AI agent that processes a batch of contracts for an SMB and aggregates insights.
 *
 * - processBatchContracts - A function that processes multiple contracts and returns an aggregated analysis.
 * - ProcessBatchContractsInput - The input type for the processBatchContracts function.
 * - ProcessBatchContractsOutput - The return type for the processBatchContracts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ContractInputSchema = z.object({
  docId: z.string().describe('A unique identifier for the contract.'),
  content: z.string().describe('The full text content of the contract.'),
});

const ProcessBatchContractsInputSchema = z.object({
  contracts: z
    .array(ContractInputSchema)
    .describe('An array of contract objects to be processed.'),
});
type ProcessBatchContractsInput = z.infer<
  typeof ProcessBatchContractsInputSchema
>;

const ProcessBatchContractsOutputSchema = z.object({
  totalContracts: z.number().describe('The total number of contracts processed.'),
  commonRisks: z
    .array(
      z.object({
        risk: z.string().describe('The description of a common risk found.'),
        count: z.number().describe('The number of contracts with this risk.'),
      })
    )
    .describe('A list of the most common risks found across all contracts.'),
  aggregateTrends: z
    .object({
      jurisdiction: z
        .record(z.number())
        .describe(
          'A key-value map where the key is the jurisdiction and the value is the count of contracts.'
        ),
    })
    .describe('Aggregated trends, such as the distribution of contracts by jurisdiction.'),
  highestRiskContracts: z
    .array(z.string())
    .describe(
      'A list of document IDs for the contracts identified as having the highest overall risk.'
    ),
});
type ProcessBatchContractsOutput = z.infer<
  typeof ProcessBatchContractsOutputSchema
>;

export async function processBatchContracts(
  input: ProcessBatchContractsInput
): Promise<ProcessBatchContractsOutput> {
  return processBatchContractsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processBatchContractsPrompt',
  input: {schema: ProcessBatchContractsInputSchema},
  output: {schema: ProcessBatchContractsOutputSchema},
  prompt: `[ROLE]
You are a legal AI assistant specializing in analyzing multiple contracts for an SMB to provide aggregated insights.

[TASK]
You will process a batch of contracts and generate a dashboard-ready summary of the entire portfolio.

[INSTRUCTIONS]
1.  Analyze all contracts provided in the input array.
2.  Count the total number of contracts processed.
3.  Identify the most common risks across all documents (e.g., "High penalty late fees") and count how many contracts contain each risk.
4.  Aggregate trends from the data. Specifically, count the number of contracts for each jurisdiction mentioned.
5.  Identify the contracts with the highest overall risk and list their document IDs.
6.  Return the result as a single JSON object that matches the output schema.

[INPUT]
A JSON object containing an array of contracts. Each contract has a 'docId' and 'content'.

[OUTPUT FORMAT] (JSON)
Respond with a JSON object that matches the output schema.
`,
});

const processBatchContractsFlow = ai.defineFlow(
  {
    name: 'processBatchContractsFlow',
    inputSchema: ProcessBatchContractsInputSchema,
    outputSchema: ProcessBatchContractsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
