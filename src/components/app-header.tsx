
'use client';

import { FileUp, Share2, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import Link from 'next/link';
import type { SampleDocument } from '@/lib/data';
import { useCallback } from 'react';

type AppHeaderProps = {
  onNewUpload: () => void;
  document: SampleDocument;
};

export default function AppHeader({ onNewUpload, document }: AppHeaderProps) {

  const handleDownload = useCallback(async () => {
    if (typeof window === 'undefined' || !document) {
        return;
    }
    
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - margin * 2;
    let y = 20;

    const addWrappedText = (text: string, options: { fontSize: number; isTitle?: boolean; isSubtitle?: boolean; }) => {
        doc.setFontSize(options.fontSize);
        if (options.isTitle) {
            doc.setFont('helvetica', 'bold');
        }

        const lines = doc.splitTextToSize(text, textWidth);
        
        if (y + (lines.length * (options.fontSize / 2)) > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }

        doc.text(lines, margin, y);
        y += (lines.length * (options.fontSize / 2)) + (options.isSubtitle ? 5 : 8);

        if (options.isTitle) {
            doc.setFont('helvetica', 'normal');
        }
    };

    addWrappedText(`Summary of ${document.title}`, { fontSize: 18, isTitle: true });

    addWrappedText('Overall Summary', { fontSize: 14, isSubtitle: true });
    addWrappedText(document.summary, { fontSize: 10 });
    
    const risks = document.clauses.filter(
        (c) => c.risk && c.risk !== 'standard'
    );

    if (risks.length > 0) {
        addWrappedText('Risks Identified', { fontSize: 16, isTitle: true });
        risks.forEach((risk) => {
            if (risk.clauseTitle && risk.risk && risk.summary_eli15) {
                addWrappedText(`${risk.clauseTitle} (Risk: ${risk.risk})`, { fontSize: 12, isSubtitle: true });
                addWrappedText(`Issue: ${risk.summary_eli15}`, { fontSize: 10 });
            }
        });
    }

    const counterProposals = document.clauses.filter(
        (c) => c.counterProposal
    );

    if (counterProposals.length > 0) {
        addWrappedText('Appendix: Suggested Counter-Proposals', { fontSize: 16, isTitle: true });
        counterProposals.forEach((clause) => {
            if (clause.counterProposal && clause.clauseTitle) {
                addWrappedText(`For clause "${clause.clauseTitle}":`, { fontSize: 12, isSubtitle: true });
                addWrappedText(clause.counterProposal, { fontSize: 10 });
            }
        });
    }

    doc.save(`${document.title.replace(/\s+/g, '_')}_Report.pdf`);

  }, [document]);


  return (
    <header className="flex items-center justify-between h-16 px-4 border-b bg-card shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onNewUpload}>
          <FileUp className="mr-2 h-4 w-4" />
          New Upload
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!document}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <ThemeToggle />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
