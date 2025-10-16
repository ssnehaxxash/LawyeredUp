
'use client';

import { useState } from 'react';
import type { SampleDocument } from '@/lib/data';
import AppHeader from '@/components/app-header';
import LeftSidebar from '@/components/left-sidebar';
import MainPanel from '@/components/main-panel';
import RightSidebar from '@/components/right-sidebar';

type AnalysisLayoutProps = {
  document: SampleDocument;
  onNewUpload: () => void;
};

export default function AnalysisLayout({ document, onNewUpload }: AnalysisLayoutProps) {
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
    const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AppHeader onNewUpload={onNewUpload} document={document} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
            documentTitle={document.title} 
            isCollapsed={isLeftSidebarCollapsed}
            onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <MainPanel document={document} />
        </main>
        <RightSidebar 
            document={document} 
            isCollapsed={isRightSidebarCollapsed}
            onToggleCollapse={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
        />
      </div>
    </div>
  );
}
