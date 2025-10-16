
"use client";

import { useState } from "react";
import DocumentUploader from "@/components/document-uploader";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUploadSample = () => {
    setIsLoading(true);
    // Clear any previous analysis from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('documentAnalysis');
    }
    // Simulate AI processing time for sample
    setTimeout(() => {
       router.push('/analysis');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
       <DocumentUploader 
        onUploadSample={handleUploadSample} 
        isLoading={isLoading} 
        setIsLoading={setIsLoading} 
      />
    </main>
  );
}

    