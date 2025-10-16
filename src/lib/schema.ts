import {z} from 'zod';

export const ClauseSchema = z.object({
  clauseId: z.string().describe('A unique identifier for the clause, e.g., "C1", "C2".'),
  type: z.string().describe('The type of clause, e.g., "Termination", "Payment", "Confidentiality".'),
  text: z.string().describe('The full body text of the clause.'),
  riskFlag: z.enum(["standard", "unusual"]).describe('A flag indicating if the clause is standard or unusual.'),
  explanation: z.string().describe('A brief explanation if the clause is flagged as unusual.'),
});
