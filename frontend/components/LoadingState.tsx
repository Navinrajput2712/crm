import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
}
