
"use client";

import { useState, useEffect } from "react";
import type { SampleDocument } from "@/lib/data";
import { sampleDocumentData } from "@/lib/data";
import AnalysisLayout from "@/components/analysis-layout";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const [document, setDocument] = useState<SampleDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDocument = localStorage.getItem('documentAnalysis');
      if (storedDocument) {
        setDocument(JSON.parse(storedDocument));
      } else {
        setDocument(sampleDocumentData);
      }
      setIsLoading(false);
    }
  }, []);

  const handleNewUpload = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('documentAnalysis');
    }
    router.push('/');
  };

  if (isLoading || !document) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading document analysis...</p>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
        <AnalysisLayout document={document} onNewUpload={handleNewUpload} />
    </main>
  );
}

    