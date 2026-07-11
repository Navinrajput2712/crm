import React from 'react';
import Link from 'next/link';
import { SummaryBar } from '../SummaryBar';
import { ResultsTable } from '../ResultsTable';
import { SkippedRecordsList } from '../SkippedRecordsList';
import { AnimatedButton } from '../AnimatedButton';
import { RefreshCw, ArrowRight } from 'lucide-react';

export function ResultsStep({ results, onStartOver, onClose }: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SummaryBar 
        totalRows={results.totalRows} 
        imported={results.imported} 
        skipped={results.skipped} 
      />
      
      <ResultsTable records={results.importedRecords} />
      <SkippedRecordsList skipped={results.skippedRecords} />
      
      <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-gray-200 mt-8 gap-4">
        <AnimatedButton variant="secondary" onClick={onStartOver}>
          <RefreshCw className="mr-2 w-4 h-4" />
          Start Over
        </AnimatedButton>
        
        <Link href="/leads" onClick={onClose} className="inline-flex">
          <AnimatedButton variant="primary" className="w-full">
            View All Leads
            <ArrowRight className="ml-2 -mr-1 w-4 h-4" />
          </AnimatedButton>
        </Link>
      </div>
    </div>
  );
}
