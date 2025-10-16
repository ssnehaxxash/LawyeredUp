
'use client';
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SampleDocument } from '@/lib/data';

// Import all the flows
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { explainLegalClause } from '@/ai/flows/explain-legal-clause-in-plain-language';
import { personalizeAnalysisWithRoleLens } from '@/ai/flows/personalize-analysis-with-role-lens';
import { identifyRisksAndSuggestCounterProposals } from '@/ai/flows/identify-risks-and-suggest-counter-proposals';
import { answerQuestionFromDocument } from '@/ai/flows/answer-question-from-document';
import { compareDocuments } from '@/ai/flows/compare-documents';
import { predictRisk } from '@/ai/flows/predict-risk';
import { predictOutcome } from '@/ai/flows/predict-outcome';
import { personalizeLegalAdvice } from '@/ai/flows/personalize-legal-advice';
import { translateLegalText } from '@/ai/flows/translate-legal-text';
import { generateCaseTimeline } from '@/ai/flows/generate-case-timeline';
import { generateCostForecast } from '@/ai/flows/generate-cost-forecast';
import { parseUploadedDocument } from '@/ai/flows/parse-uploaded-document';
import { checkMissingContracts } from '@/ai/flows/check-missing-contracts';
import { generateLegalLensSummary } from '@/ai/flows/generate-legal-lens-summary';
import { trackCompliance } from '@/ai/flows/track-compliance';
import { compareToMarketStandards } from '@/ai/flows/compare-to-market-standards';
import { flagUncertainClauses } from '@/ai/flows/flag-uncertain-clauses';
import { generateSuggestedQuestions } from '@/ai/flows/generate-suggested-questions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type AskAIProps = {
  document: SampleDocument;
};

const FeatureContainer = ({ title, children, onOpen }: { title: string; children: React.ReactNode, onOpen?: () => void }) => (
  <AccordionItem value={title}>
    <AccordionTrigger onFocus={onOpen ? () => onOpen() : undefined}>{title}</AccordionTrigger>
    <AccordionContent>
      <div className="p-4 border rounded-md bg-muted/20">
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
);

const ResultDisplay = ({ result }: { result: any }) => (
    <pre className="mt-4 p-4 bg-background rounded-md border text-sm max-h-96 overflow-auto whitespace-pre-wrap break-words">
      {JSON.stringify(result, null, 2)}
    </pre>
  );

export default function AskAI({ document }: AskAIProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [question, setQuestion] = useState("What is the late fee for rent?");
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false);
  const { toast } = useToast();

  const getFullDocumentText = () => document.clauses.map(c => c.text).join('\n\n');

  const runFlow = async (flowName: string, flowFn: () => Promise<any>) => {
    setIsLoading(flowName);
    setResults(prev => ({ ...prev, [flowName]: null }));
    try {
      const result = await flowFn();
      setResults(prev => ({ ...prev, [flowName]: result }));
    } catch (error) {
      console.error(`Error running ${flowName}:`, error);
      toast({
        title: 'An error occurred',
        description: `Failed to run ${flowName}.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>, flowName: string, flowFn: () => Promise<any>) => {
    e.preventDefault();
    runFlow(flowName, flowFn);
  };
  
  const handleGenerateQuestions = async () => {
    if (hasGeneratedQuestions) return;
    setIsLoading('suggestedQuestions');
    try {
        const result = await generateSuggestedQuestions({ documentText: getFullDocumentText() });
        setSuggestedQuestions(result.questions);
        setHasGeneratedQuestions(true);
    } catch(error) {
        console.error("Failed to get suggested questions", error);
        toast({
            title: "Could not generate suggestions",
            variant: "destructive"
        })
    } finally {
        setIsLoading(null);
    }
  }


  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
       <FeatureContainer title="0. Parse Uploaded Document">
        <form onSubmit={(e) => handleFormSubmit(e, 'parse', () => parseUploadedDocument({ documentText: getFullDocumentText() }))}>
            <p className="text-sm text-muted-foreground mb-4">Extract structured data from the document. This is a required first step for many features below.</p>
            <Button type="submit" disabled={isLoading === 'parse'}>
            {isLoading === 'parse' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Parse Document
          </Button>
          {results.parse && <ResultDisplay result={results.parse} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="1. Summarize Document">
        <form onSubmit={(e) => handleFormSubmit(e, 'summarize', () => summarizeDocument({ documentText: getFullDocumentText() }))}>
            <p className="text-sm text-muted-foreground mb-4">Get a TL;DR summary of the entire document.</p>
            <Button type="submit" disabled={isLoading === 'summarize'}>
            {isLoading === 'summarize' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Summary
          </Button>
          {results.summarize && <ResultDisplay result={results.summarize} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="2. Explain Legal Clause in Plain Language">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const clause = formData.get('clause') as string;
          runFlow('explain', () => explainLegalClause({ clause }));
        }}>
          <Label htmlFor="clause-text">Clause to Explain</Label>
          <Textarea id="clause-text" name="clause" defaultValue={document.clauses[0].text} className="mt-1 mb-2" />
          <Button type="submit" disabled={isLoading === 'explain'}>
            {isLoading === 'explain' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Explain Clause
          </Button>
          {results.explain && <ResultDisplay result={results.explain} />}
        </form>
      </FeatureContainer>
      
      <FeatureContainer title="3. Personalize Analysis with Role Lens">
        {results.parse ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const role = formData.get('role') as string;
              if (!role) {
                toast({ title: "Please select a role", variant: "destructive" });
                return;
              }
              runFlow('personalize', () => personalizeAnalysisWithRoleLens({ documentText: getFullDocumentText(), role }));
            }}>
                <Label htmlFor="role-select">Select Your Role</Label>
                <Select name="role">
                    <SelectTrigger id="role-select" className="my-1">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {(results.parse.parties as string[] || []).map(party => (
                            <SelectItem key={party} value={party}>{party}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="submit" className="mt-2" disabled={isLoading === 'personalize'}>
                    {isLoading === 'personalize' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Personalized Analysis
                </Button>
                {results.personalize && <ResultDisplay result={results.personalize} />}
            </form>
        ) : (
            <p className="text-sm text-muted-foreground">Please run "Parse Uploaded Document" first to identify roles in the contract.</p>
        )}
      </FeatureContainer>

      <FeatureContainer title="4. Identify Risks &amp; Suggest Counter-Proposals">
         {results.parse ? (
            <form onSubmit={(e) => handleFormSubmit(e, 'identifyRisks', () => identifyRisksAndSuggestCounterProposals({ clauses: results.parse.clauses }))}>
                <p className="text-sm text-muted-foreground mb-4">Analyze the full document for risks and get counter-proposals.</p>
                <Button type="submit" disabled={isLoading === 'identifyRisks'}>
                {isLoading === 'identifyRisks' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Identify Risks
              </Button>
              {results.identifyRisks && <ResultDisplay result={results.identifyRisks} />}
            </form>
         ) : (
            <p className="text-sm text-muted-foreground">Please run "Parse Uploaded Document" first to provide the clauses for analysis.</p>
         )}
      </FeatureContainer>

      <FeatureContainer title="5. Answer Question from Document" onOpen={handleGenerateQuestions}>
        <form onSubmit={(e) => {
          e.preventDefault();
          runFlow('answerQuestion', () => answerQuestionFromDocument({ user_question: question, contract_text: getFullDocumentText() }));
        }}>
          <Label htmlFor="user_question">Your Question</Label>
          <Input id="user_question" name="user_question" value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1 mb-4" />
          
          {suggestedQuestions.length > 0 && (
              <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-primary" /> AI Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q, i) => (
                        <Button key={i} variant="outline" size="sm" type="button" onClick={() => setQuestion(q)}>
                            {q}
                        </Button>
                    ))}
                  </div>
              </div>
          )}

          <Button type="submit" disabled={isLoading === 'answerQuestion'}>
            {isLoading === 'answerQuestion' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Answer
          </Button>
          {results.answerQuestion && <ResultDisplay result={results.answerQuestion} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="6. Compare Contract Versions">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const docText1 = formData.get('docText1') as string;
          const docText2 = formData.get('docText2') as string;
          runFlow('compare', () => compareDocuments({ docText1, docText2 }));
        }}>
          <Label htmlFor="docText1">Old Version Text</Label>
          <Textarea id="docText1" name="docText1" defaultValue={document.clauses.map(c => c.text).join('\n')} className="mt-1 mb-4" />
          <Label htmlFor="docText2">New Version Text</Label>
          <Textarea id="docText2" name="docText2" defaultValue={document.clauses.map(c => c.text.replace('60 days', '30 days')).join('\n')} className="mt-1 mb-4" />
          <Button type="submit" disabled={isLoading === 'compare'}>
            {isLoading === 'compare' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Compare Versions
          </Button>
          {results.compare && <ResultDisplay result={results.compare} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="7. Predict Risk">
        <form onSubmit={(e) => handleFormSubmit(e, 'predictRisk', () => predictRisk({ documentText: getFullDocumentText() }))}>
          <p className="text-sm text-muted-foreground mb-4">Analyze the document to identify potential risks, liabilities, and unfavorable clauses.</p>
          <Button type="submit" disabled={isLoading === 'predictRisk'}>
            {isLoading === 'predictRisk' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Predict Document Risk
          </Button>
          {results.predictRisk && <ResultDisplay result={results.predictRisk} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="8. Predict Outcome">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const caseType = formData.get('caseType-outcome') as string;
          const jurisdiction = formData.get('jurisdiction-outcome') as string;
          const involvedParties = formData.get('involvedParties-outcome') as string;
          const evidenceStrength = formData.get('evidenceStrength-outcome') as string;
          const pastJudgments = formData.get('pastJudgments-outcome') as string;
          runFlow('predictOutcome', () => predictOutcome({ caseType, jurisdiction, involvedParties, evidenceStrength, pastJudgments }));
        }}>
            <div className="grid grid-cols-2 gap-4 mb-2">
                <div><Label htmlFor="caseType-outcome">Case Type</Label><Input id="caseType-outcome" name="caseType-outcome" defaultValue="Employment Dispute" /></div>
                <div><Label htmlFor="jurisdiction-outcome">Jurisdiction</Label><Input id="jurisdiction-outcome" name="jurisdiction-outcome" defaultValue="Bangalore" /></div>
                <div><Label htmlFor="involvedParties-outcome">Involved Parties</Label><Input id="involvedParties-outcome" name="involvedParties-outcome" defaultValue="Employee vs. Company" /></div>
                <div><Label htmlFor="evidenceStrength-outcome">Evidence Strength</Label><Input id="evidenceStrength-outcome" name="evidenceStrength-outcome" defaultValue="Strong email trails" /></div>
            </div>
            <Label htmlFor="pastJudgments-outcome">Past Judgements</Label>
            <Input id="pastJudgments-outcome" name="pastJudgments-outcome" defaultValue="Similar cases favor employee" className="mt-1 mb-2" />
          <Button type="submit" disabled={isLoading === 'predictOutcome'}>
            {isLoading === 'predictOutcome' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Predict Outcome
          </Button>
          {results.predictOutcome && <ResultDisplay result={results.predictOutcome} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="9. Personalize Legal Advice">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const location = formData.get('location-advice') as string;
          const profession = formData.get('profession-advice') as string;
          const profileSummary = formData.get('profileSummary-advice') as string;
          runFlow('personalizeAdvice', () => personalizeLegalAdvice({ location, profession, profileSummary }));
        }}>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div><Label htmlFor="location-advice">Location</Label><Input id="location-advice" name="location-advice" defaultValue="Pune" /></div>
            <div><Label htmlFor="profession-advice">Profession</Label><Input id="profession-advice" name="profession-advice" defaultValue="Small Business Owner" /></div>
          </div>
          <Label htmlFor="profileSummary-advice">Profile Summary</Label>
          <Input id="profileSummary-advice" name="profileSummary-advice" defaultValue="Signs frequent vendor contracts" className="mt-1 mb-2" />
          <Button type="submit" disabled={isLoading === 'personalizeAdvice'}>
            {isLoading === 'personalizeAdvice' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Advice
          </Button>
          {results.personalizeAdvice && <ResultDisplay result={results.personalizeAdvice} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="10. Translate Legal Text">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const text_to_translate = formData.get('text_to_translate') as string;
          const target_language = formData.get('target_language') as string;
          runFlow('translate', () => translateLegalText({ text_to_translate, target_language }));
        }}>
          <Label htmlFor="text_to_translate">Text to Translate</Label>
          <Textarea id="text_to_translate" name="text_to_translate" defaultValue="Tenant must vacate within 30 days due to non-payment." className="mt-1 mb-2" />
          <Label htmlFor="target_language">Target Language</Label>
          <Input id="target_language" name="target_language" defaultValue="Hindi" className="mt-1 mb-2" />
          <Button type="submit" disabled={isLoading === 'translate'}>
            {isLoading === 'translate' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Translate
          </Button>
          {results.translate && <ResultDisplay result={results.translate} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="11. Generate Case Timeline">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const caseId = formData.get('caseId-timeline') as string;
          const caseType = formData.get('caseType-timeline') as string;
          const jurisdiction = formData.get('jurisdiction-timeline') as string;
          const lastKnownStatus = formData.get('lastKnownStatus-timeline') as string;
          runFlow('timeline', () => generateCaseTimeline({ caseId, caseType, jurisdiction, lastKnownStatus }));
        }}>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div><Label htmlFor="caseId-timeline">Case ID</Label><Input id="caseId-timeline" name="caseId-timeline" defaultValue="EMP2025-123" /></div>
            <div><Label htmlFor="caseType-timeline">Case Type</Label><Input id="caseType-timeline" name="caseType-timeline" defaultValue="Employment Dispute" /></div>
            <div><Label htmlFor="jurisdiction-timeline">Jurisdiction</Label><Input id="jurisdiction-timeline" name="jurisdiction-timeline" defaultValue="Bangalore District Court" /></div>
            <div><Label htmlFor="lastKnownStatus-timeline">Last Known Status</Label><Input id="lastKnownStatus-timeline" name="lastKnownStatus-timeline" defaultValue="Last hearing July 2025" /></div>
          </div>
          <Button type="submit" disabled={isLoading === 'timeline'}>
            {isLoading === 'timeline' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Timeline
          </Button>
          {results.timeline && <ResultDisplay result={results.timeline} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="12. Generate Cost Forecast">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const caseType = formData.get('caseType-cost') as string;
          const jurisdiction = formData.get('jurisdiction-cost') as string;
          const complexity = formData.get('complexity-cost') as string;
          const lawyerType = formData.get('lawyerType-cost') as string;
          runFlow('cost', () => generateCostForecast({ caseType, jurisdiction, complexity, lawyerType }));
        }}>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div><Label htmlFor="caseType-cost">Case Type</Label><Input id="caseType-cost" name="caseType-cost" defaultValue="Divorce" /></div>
            <div><Label htmlFor="jurisdiction-cost">Jurisdiction</Label><Input id="jurisdiction-cost" name="jurisdiction-cost" defaultValue="Bangalore" /></div>
            <div><Label htmlFor="complexity-cost">Complexity</Label><Input id="complexity-cost" name="complexity-cost" defaultValue="Contested with child custody" /></div>
            <div><Label htmlFor="lawyerType-cost">Lawyer Type</Label><Input id="lawyerType-cost" name="lawyerType-cost" defaultValue="Mid-tier" /></div>
          </div>
          <Button type="submit" disabled={isLoading === 'cost'}>
            {isLoading === 'cost' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Forecast
          </Button>
          {results.cost && <ResultDisplay result={results.cost} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="13. Check Missing Contracts">
        <form onSubmit={(e) => handleFormSubmit(e, 'checkMissing', () => checkMissingContracts({ mainContractContent: getFullDocumentText() }))}>
           <p className="text-sm text-muted-foreground mb-4">Analyze the current document and suggest other contracts that might be needed.</p>
          <Button type="submit" disabled={isLoading === 'checkMissing'}>
            {isLoading === 'checkMissing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Check for Missing Contracts
          </Button>
          {results.checkMissing && <ResultDisplay result={results.checkMissing} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="14. Generate Legal Lens Summary">
        <form onSubmit={(e) => handleFormSubmit(e, 'legalLens', () => generateLegalLensSummary({ documentText: getFullDocumentText() }))}>
            <p className="text-sm text-muted-foreground mb-4">Generate summaries for different audiences (Lawyer, Layman, Risk-focused).</p>
            <Button type="submit" disabled={isLoading === 'legalLens'}>
            {isLoading === 'legalLens' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Summaries
          </Button>
          {results.legalLens && <ResultDisplay result={results.legalLens} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="15. Track Compliance">
        <form onSubmit={(e) => handleFormSubmit(e, 'trackCompliance', () => trackCompliance({ documentText: getFullDocumentText() }))}>
            <p className="text-sm text-muted-foreground mb-4">Extract key dates and obligations from the document.</p>
            <Button type="submit" disabled={isLoading === 'trackCompliance'}>
            {isLoading === 'trackCompliance' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Track Compliance
          </Button>
          {results.trackCompliance && <ResultDisplay result={results.trackCompliance} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="16. Compare to Market Standards">
        <form onSubmit={(e) => handleFormSubmit(e, 'marketStandards', () => compareToMarketStandards({ documentText: getFullDocumentText() }))}>
            <p className="text-sm text-muted-foreground mb-4">Compare contract clauses against industry benchmarks.</p>
            <Button type="submit" disabled={isLoading === 'marketStandards'}>
            {isLoading === 'marketStandards' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Compare
          </Button>
          {results.marketStandards && <ResultDisplay result={results.marketStandards} />}
        </form>
      </FeatureContainer>

      <FeatureContainer title="17. Confidence Alerts">
        <form onSubmit={(e) => handleFormSubmit(e, 'confidenceAlerts', () => flagUncertainClauses({ documentText: getFullDocumentText() }))}>
            <p className="text-sm text-muted-foreground mb-4">Identify ambiguous clauses and get confidence scores.</p>
            <Button type="submit" disabled={isLoading === 'confidenceAlerts'}>
            {isLoading === 'confidenceAlerts' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Flag Uncertain Clauses
          </Button>
          {results.confidenceAlerts && <ResultDisplay result={results.confidenceAlerts} />}
        </form>
      </FeatureContainer>

    </Accordion>
  );
}
