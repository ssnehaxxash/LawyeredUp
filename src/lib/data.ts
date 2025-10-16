export type Clause = {
  id: string;
  clauseTitle?: string;
  text: string;
  risk?: 'risky' | 'standard' | 'negotiable';
  summary_eli5: string;
  summary_eli15: string;
  counterProposal?: string;
};

export type SampleDocument = {
  title: string;
  summary: string;
  clauses: Clause[];
};

export const sampleDocumentData: SampleDocument = {
  title: 'Standard Residential Lease Agreement',
  summary: 'This is a standard rental contract. It has one risky clause about the security deposit and two negotiable points regarding maintenance and early termination. Overall, it is mostly fair but review the highlighted sections carefully.',
  clauses: [
    {
      id: 'c1',
      clauseTitle: 'Parties',
      text: 'This Lease Agreement ("the Agreement") is made and entered into this 1st day of August, 2024, by and between John Landlord ("Landlord") and Jane Tenant ("Tenant").',
      risk: 'standard',
      summary_eli5: 'This says who the landlord and tenant are.',
      summary_eli15: 'This clause identifies the official parties bound by this contract: the person who owns the property (Landlord) and the person renting it (Tenant).',
    },
    {
      id: 'c2',
      clauseTitle: 'Property',
      text: 'Landlord agrees to lease to Tenant the property located at 123 Main Street, Anytown, USA 12345 ("the Property").',
      risk: 'standard',
      summary_eli5: 'This is the address of the place you are renting.',
      summary_eli15: 'This section specifies the exact address of the property that the Tenant is renting from the Landlord.',
    },
    {
      id: 'c3',
      clauseTitle: 'Lease Term',
      text: 'The term of this lease shall be for a period of 12 months, beginning on September 1, 2024, and ending on August 31, 2025.',
      risk: 'standard',
      summary_eli5: 'Your lease is for one year.',
      summary_eli15: 'This clause defines the duration of the lease. It specifies a fixed term of 12 months, including the official start and end dates of the rental period.',
    },
    {
      id: 'c4',
      clauseTitle: 'Rent',
      text: 'Tenant shall pay Landlord a monthly rent of $2,000, due on the 1st day of each month. A late fee of $100 will be applied if rent is not received by the 5th day of the month.',
      risk: 'standard',
      summary_eli5: 'Rent is $2,000 a month, due on the 1st. You get a $100 late fee after the 5th.',
      summary_eli15: 'This sets the monthly rent amount at $2,000, payable on the first of each month. It also establishes a $100 penalty if the payment is made after the 5th of the month.',
    },
    {
      id: 'c5',
      clauseTitle: 'Security Deposit',
      text: 'Tenant shall deposit with Landlord the sum of $4,000 as a security deposit. Landlord may use, apply or retain the whole or any part of the security deposit for any breach of this agreement. Landlord shall have 60 days after termination of tenancy to return the security deposit, less any deductions.',
      risk: 'risky',
      summary_eli5: 'You pay a $4,000 deposit. The landlord has 60 days to give it back and can use it for any broken rule.',
      summary_eli15: 'This clause requires a $4,000 security deposit. It gives the landlord broad power to use the deposit for any rule violation and allows a 60-day period to return it, which is longer than standard in many jurisdictions.',
      counterProposal: 'The security deposit shall not exceed the value of one month\'s rent ($2,000). The landlord must return the security deposit, less itemized deductions, within 30 days of tenancy termination, in accordance with state law.',
    },
    {
      id: 'c6',
      clauseTitle: 'Utilities',
      text: 'Tenant shall be responsible for payment of all utilities and services, including but not limited to electricity, gas, water, and internet.',
      risk: 'standard',
      summary_eli5: 'You have to pay for all your own bills like power and internet.',
      summary_eli15: 'This clause clarifies that the Tenant is responsible for arranging and paying for all utility services for the property, such as electricity, gas, water, and internet access.',
    },
    {
      id: 'c7',
      clauseTitle: 'Maintenance and Repairs',
      text: 'Tenant shall maintain the property in a clean and sanitary condition. All repairs, excluding major structural issues, will be the responsibility of the Tenant.',
      risk: 'negotiable',
      summary_eli5: 'You must keep it clean and fix most things that break yourself.',
      summary_eli15: 'This clause makes the Tenant responsible for general cleanliness and most repairs, except for major structural problems. This is broader than typical leases, where landlords often cover appliance and system repairs.',
      counterProposal: 'Tenant is responsible for minor repairs and cleanliness. Landlord is responsible for repairs to all appliances, plumbing, and HVAC systems provided with the property.',
    },
    {
      id: 'c8',
      clauseTitle: 'Subletting',
      text: 'Tenant shall not sublet the property or assign this agreement without the prior written consent of the Landlord.',
      risk: 'standard',
      summary_eli5: 'You can\'t let someone else rent your place unless the landlord says it\'s okay in writing.',
      summary_eli15: 'This clause prohibits the Tenant from renting out the property (subletting) or transferring the lease to someone else without first obtaining written permission from the Landlord.',
    },
    {
      id: 'c9',
      clauseTitle: 'Termination',
      text: 'If Tenant wishes to terminate this lease early, they must provide 60 days\' notice and pay a termination fee equal to three months\' rent.',
      risk: 'negotiable',
      summary_eli5: 'To leave early, you need to tell the landlord 60 days before and pay a big fee (3 months of rent).',
      summary_eli15: 'This clause outlines the penalties for early lease termination. The required 60-day notice and a fee equivalent to three months\' rent is steep and could be negotiated down.',
      counterProposal: 'For early termination, Tenant must provide 30 days\' written notice and pay a fee equal to one month\'s rent.',
    },
     {
      id: 'c10',
      clauseTitle: 'Governing Law',
      text: 'This agreement shall be governed by and construed in accordance with the laws of the State of California.',
      risk: 'standard',
      summary_eli5: 'The rules for this contract are based on California law.',
      summary_eli15: 'This clause specifies that any legal interpretation or dispute related to this agreement will be resolved according to the laws of the State of California.',
    },
  ],
};
