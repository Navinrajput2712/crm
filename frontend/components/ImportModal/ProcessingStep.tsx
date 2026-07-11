import React from 'react';
import { LoadingState } from '../LoadingState';

export function ProcessingStep() {
  return (
    <div className="py-12">
      <LoadingState message="Processing your leads with AI... This may take a moment." />
    </div>
  );
}
