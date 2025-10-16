
'use client';
import * as React from 'react';
import type { SampleDocument, Clause as ClauseType } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Bot, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import AskAI from './ask-ai';
import { riskIcons, riskColors } from '@/lib/risk-utils';

const Clause = ({ clause, summaryType }: { clause: ClauseType, summaryType: 'eli5' | 'eli15' }) => {
    const summary = summaryType === 'eli5' ? clause.summary_eli5 : clause.summary_eli15;
    
    if (!clause.risk || clause.risk === 'standard') {
        return <span>{clause.text} </span>;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <span className={cn(
                    "cursor-pointer rounded p-0.5 transition-colors",
                     clause.risk ? riskColors[clause.risk] : '',
                )}>
                    {clause.text}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-96 shadow-xl" align="start">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {clause.risk ? riskIcons[clause.risk] : null}
                        <h4 className="font-semibold text-lg capitalize">{clause.risk} Clause</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{summary}</p>
                    
                    {clause.counterProposal && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Bot className="h-5 w-5 text-primary"/>
                                <h5 className="font-semibold text-primary">Suggested Counter-Proposal</h5>
                            </div>
                            <p className="text-sm bg-primary/10 p-3 rounded-md border border-primary/20">{clause.counterProposal}</p>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                        <Button variant="ghost" size="sm">
                            <Volume2 className="h-4 w-4 mr-2" />
                            Read aloud
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default function MainPanel({ document }: { document: SampleDocument }) {
    const [summaryType, setSummaryType] = React.useState<'eli5' | 'eli15'>('eli5');

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="summary" className="flex flex-col flex-1 overflow-hidden">
                <div className="px-6 py-3 border-b bg-card">
                    <TabsList>
                        <TabsTrigger value="summary">Document View</TabsTrigger>
                        <TabsTrigger value="ask_ai">Ask AI</TabsTrigger>
                        <TabsTrigger value="navigator">Clause Navigator</TabsTrigger>
                        <TabsTrigger value="precedent">Precedent Cases</TabsTrigger>
                    </TabsList>
                </div>
                <div className="flex items-center justify-between px-6 py-2 border-b bg-card">
                     <h2 className="text-lg font-semibold truncate">{document.title}</h2>
                     <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Explain like I'm:</span>
                        <Tabs value={summaryType} onValueChange={(value) => setSummaryType(value as 'eli5' | 'eli15')} className="w-[150px]">
                            <TabsList className="grid w-full grid-cols-2 h-8">
                                <TabsTrigger value="eli5" className="text-xs h-6">5</TabsTrigger>
                                <TabsTrigger value="eli15" className="text-xs h-6">15</TabsTrigger>
                            </TabsList>
                        </Tabs>
                     </div>
                </div>
                
                <ScrollArea className="flex-1 bg-background">
                    <div className="p-6 lg:p-10">
                        <TabsContent value="summary" className="mt-0 ring-offset-0 focus-visible:ring-0">
                            <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                                {document.clauses.map((clause) => (
                                   <p key={clause.id} className="inline">
                                     <Clause clause={clause} summaryType={summaryType}/>
                                   </p>
                                ))}
                            </div>
                         </TabsContent>
                         <TabsContent value="ask_ai" className="mt-0 ring-offset-0 focus-visible:ring-0">
                            <AskAI document={document} />
                         </TabsContent>
                         <TabsContent value="navigator" className="mt-0 ring-offset-0 focus-visible:ring-0">
                            <p className="text-sm text-muted-foreground">Jump to specific clauses in the document.</p>
                         </TabsContent>
                          <TabsContent value="precedent" className="mt-0 ring-offset-0 focus-visible:ring-0">
                            <p className="text-sm text-muted-foreground">Related legal precedents and case law.</p>
                         </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    )
}
