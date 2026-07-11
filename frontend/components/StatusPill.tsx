import React from 'react';
import type { CRMStatus } from '../types/crm';

export function StatusPill({ status }: { status: CRMStatus | string }) {
  let colorClass = 'bg-gray-100 text-gray-800';
  let label = status;
  
  if (status === 'SALE_DONE') {
    colorClass = 'bg-blue-100 text-blue-800';
    label = 'Sale Done';
  } else if (status === 'GOOD_LEAD_FOLLOW_UP') {
    colorClass = 'bg-green-100 text-green-800';
    label = 'Good Lead';
  } else if (status === 'BAD_LEAD') {
    colorClass = 'bg-red-100 text-red-800';
    label = 'Bad Lead';
  } else if (status === 'DID_NOT_CONNECT') {
    colorClass = 'bg-gray-100 text-gray-800';
    label = 'Not Dialed';
  }

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}
